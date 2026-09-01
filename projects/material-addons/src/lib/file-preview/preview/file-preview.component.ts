import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  OnDestroy,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateService } from '@ngx-translate/core';

import {
  DEFAULT_FILE_PREVIEW_CONFIG,
  DEFAULT_FILE_PREVIEW_LABELS,
  FilePreviewAction,
  FilePreviewConfig,
  FilePreviewItem,
  FilePreviewLabels,
  ResolvedFilePreviewItem,
  THUMBNAIL_SIZE_MAP,
  ThumbnailSize,
} from '../models/file-preview.models';
import { FilePreviewService } from '../services/file-preview.service';
import { FilePreviewDialogComponent, FilePreviewDialogData, FilePreviewDialogResult } from './file-preview-dialog.component';
import { DocxPreviewComponent } from '../components/docx-preview/docx-preview.component';

type FileActionVisibilityKey = 'previewAction' | 'downloadAction' | 'deleteAction';
type Dimensions = { width: number; height: number };

@Component({
  selector: 'mad-file-preview',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, DocxPreviewComponent],
  providers: [FilePreviewService],
  templateUrl: './file-preview.component.html',
  styleUrls: ['./file-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilePreviewComponent implements OnDestroy {
  readonly items = input<FilePreviewItem[] | null>(null);
  readonly config = input<FilePreviewConfig>(DEFAULT_FILE_PREVIEW_CONFIG);
  readonly labels = input<FilePreviewLabels | undefined>(undefined);

  readonly previewOpened = output<ResolvedFilePreviewItem>();
  readonly actionClicked = output<{ action: FilePreviewAction; item: ResolvedFilePreviewItem }>();
  readonly deleteClicked = output<ResolvedFilePreviewItem>();

  readonly resolvedItems = signal<ResolvedFilePreviewItem[]>([]);

  private dialogRef?: MatDialogRef<FilePreviewDialogComponent, FilePreviewDialogResult>;
  private loadRequestId = 0;
  private loadDebounceTimer?: ReturnType<typeof setTimeout>;
  private readonly i18nLabels = signal<Partial<FilePreviewLabels>>({});

  readonly mergedConfig = computed(() => ({ ...DEFAULT_FILE_PREVIEW_CONFIG, ...(this.config() ?? {}) }));
  readonly thumbnailDimensions = computed(() => this.resolveSize(this.mergedConfig().thumbnailSize));
  readonly mergedLabels = computed(() => {
    // Merge in priority order: user-provided labels > i18n translations > defaults
    return {
      ...DEFAULT_FILE_PREVIEW_LABELS,
      ...this.i18nLabels(),
      ...(this.labels() ?? {}),
    } as Required<FilePreviewLabels>;
  });
  readonly visibleCustomActions = computed(() => this.mergedConfig().actions ?? []);
  readonly hasVisibleActions = computed(() =>
    this.mergedConfig().showActionIcons &&
    Boolean(
      (this.mergedConfig().showOverlayPreview && this.mergedConfig().showPreviewAction) ||
        this.mergedConfig().showDownloadAction ||
        this.mergedConfig().showDeleteAction ||
        this.visibleCustomActions().length > 0,
    ),
  );

  constructor(
    private readonly filePreviewService: FilePreviewService,
    private readonly dialog: MatDialog,
    private readonly translate: TranslateService,
  ) {
    this.loadI18nLabels();

    // React to items input changes using an effect so signals drive template updates
    effect(() => {
      const itemsVal = typeof this.items === 'function' ? this.items() : this.items;
      void this.scheduleLoadItems(itemsVal ?? []);
    });
  }

  private loadI18nLabels(): void {
    this.translate.get('components.file-preview').subscribe((translations: Partial<FilePreviewLabels>) => {
      if (translations && typeof translations === 'object') {
        // Filter to keep only truthy string values
        const i18nLabels: Partial<FilePreviewLabels> = Object.fromEntries(
          Object.entries(translations).filter(([, value]) => typeof value === 'string' && value.length > 0),
        ) as Partial<FilePreviewLabels>;
        this.i18nLabels.set(i18nLabels);
      }
    });
  }

  ngOnDestroy(): void {
    this.dialogRef?.close();
    this.filePreviewService.releaseResources();
  }

  trackById(_: number, item: ResolvedFilePreviewItem): string {
    return item.id;
  }

  trackByActionId(_: number, action: FilePreviewAction): string {
    return action.id;
  }

  formatFileSize(bytes?: number): string {
    return this.filePreviewService.formatFileSize(bytes);
  }

  openPreview(item: ResolvedFilePreviewItem): void {
    if (!this.mergedConfig().showOverlayPreview) {
      return;
    }

    const data: FilePreviewDialogData = {
      item,
      config: this.mergedConfig(),
      labels: this.mergedLabels(),
      visibleCustomActions: this.visibleCustomActions(),
      isDownloadVisible: this.isFileActionVisible('downloadAction'),
      isDeleteVisible: this.isFileActionVisible('deleteAction'),
    };

    this.previewOpened.emit(item);

    this.dialogRef = this.dialog.open<FilePreviewDialogComponent, FilePreviewDialogData, FilePreviewDialogResult>(
      FilePreviewDialogComponent,
      {
        data,
        // size is applied by the dialog component itself for responsive behavior
        panelClass: 'fp-mat-dialog',
        autoFocus: false,
      },
    );

    this.dialogRef.afterClosed().subscribe((result) => {
      this.dialogRef = undefined;
      if (!result) {
        return;
      }
      if (result.type === 'delete') {
        this.deleteClicked.emit(result.item);
      } else if (result.type === 'action') {
        this.actionClicked.emit({ action: result.action, item: result.item });
      }
    });
  }

  triggerAction(action: FilePreviewAction, item: ResolvedFilePreviewItem): void {
    this.actionClicked.emit({ action, item });
  }

  triggerDelete(item: ResolvedFilePreviewItem): void {
    this.deleteClicked.emit(item);
  }

  download(item: ResolvedFilePreviewItem): void {
    this.filePreviewService.download(item);
  }

  isFileActionVisible(action: FileActionVisibilityKey): boolean {
    return this.computeFileActionVisible(action);
  }

  private scheduleLoadItems(items: FilePreviewItem[]): void {
    if (this.loadDebounceTimer) {
      clearTimeout(this.loadDebounceTimer);
    }
    this.loadDebounceTimer = setTimeout(() => {
      void this.loadItems(items);
      this.loadDebounceTimer = undefined;
    }, 250);
  }

  private async loadItems(items: FilePreviewItem[]): Promise<void> {
    const requestId = ++this.loadRequestId;
    const keepUrls = new Set<string>();

    // Clear immediately so stale thumbnails don't linger and the empty state shows at once.
    this.resolvedItems.set([]);
    this.retainCurrentObjectUrls();

    if (items.length === 0) {
      return;
    }

    // Process items in small batches so the first results appear quickly instead of
    // waiting for every file to resolve — critical when PDF thumbnail generation is
    // enabled, as each page render can take hundreds of milliseconds.
    const BATCH_SIZE = 10;
    for (let i = 0; i < items.length; i += BATCH_SIZE) {
      if (requestId !== this.loadRequestId) {
        return;
      }
      const batch = items.slice(i, i + BATCH_SIZE);
      let batchResolved: ResolvedFilePreviewItem[];
      try {
        const config = this.mergedConfig();
        batchResolved = await this.filePreviewService.resolveItems(batch, {
          generatePdfThumbnails: config.generatePdfThumbnails,
          generateDocxThumbnails: config.generateDocxThumbnails,
        });
      } catch (err) {
        console.error('[FilePreviewComponent.loadItems] Batch resolution failed:', err);
        if (requestId !== this.loadRequestId) {
          return;
        }
        // Retain partial results from previous batches and stop further processing.
        return;
      }
      if (requestId !== this.loadRequestId) {
        return;
      }
      this.resolvedItems.update((current) => [...current, ...batchResolved]);
      this.collectItemUrls(batchResolved, keepUrls);
      this.filePreviewService.retainOnlyObjectUrls(keepUrls);
    }
  }

  private collectItemUrls(items: ResolvedFilePreviewItem[], keepUrls: Set<string>): void {
    for (const item of items) {
      if (item.resolvedPreviewUrl) {
        keepUrls.add(item.resolvedPreviewUrl);
      }
      if (item.resolvedThumbnailUrl) {
        keepUrls.add(item.resolvedThumbnailUrl);
      }
    }
  }

  private retainCurrentObjectUrls(): void {
    const keepUrls = new Set<string>();
    this.collectItemUrls(this.resolvedItems(), keepUrls);
    this.filePreviewService.retainOnlyObjectUrls(keepUrls);
  }
  private computeFileActionVisible(action: FileActionVisibilityKey): boolean {
    const cfg = this.mergedConfig();
    if (!cfg.showActionIcons) {
      return false;
    }
    switch (action) {
      case 'previewAction':
        return cfg.showOverlayPreview && cfg.showPreviewAction;
      case 'downloadAction':
        return cfg.showDownloadAction;
      case 'deleteAction':
        return cfg.showDeleteAction;
    }
  }



  private resolveSize(size: ThumbnailSize): Dimensions {
    if (typeof size === 'object') {
      return size;
    }
    return THUMBNAIL_SIZE_MAP[size] ?? THUMBNAIL_SIZE_MAP.md;
  }
}
