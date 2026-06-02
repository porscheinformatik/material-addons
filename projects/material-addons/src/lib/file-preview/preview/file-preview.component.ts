import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable, Subscription, isObservable, of } from 'rxjs';

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

type FileActionVisibilityKey = 'previewAction' | 'downloadAction' | 'deleteAction';

@Component({
  selector: 'mad-file-preview',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './file-preview.component.html',
  styleUrls: ['./file-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilePreviewComponent implements OnInit, OnChanges, OnDestroy {
  @Input() items: FilePreviewItem[] | null = null;
  @Input() itemsStream: Observable<FilePreviewItem[]> | null = null;
  @Input() config: FilePreviewConfig = DEFAULT_FILE_PREVIEW_CONFIG;
  @Input() labels?: FilePreviewLabels;

  @Output() readonly previewOpened = new EventEmitter<ResolvedFilePreviewItem>();
  @Output() readonly actionClicked = new EventEmitter<{
    action: FilePreviewAction;
    item: ResolvedFilePreviewItem;
  }>();
  @Output() readonly deleteClicked = new EventEmitter<ResolvedFilePreviewItem>();

  resolvedItems: ResolvedFilePreviewItem[] = [];

  private itemsSubscription?: Subscription;
  private dialogRef?: MatDialogRef<FilePreviewDialogComponent, FilePreviewDialogResult>;
  private loadRequestId = 0;
  private mergedConfigState: typeof DEFAULT_FILE_PREVIEW_CONFIG = this.buildMergedConfig();
  private thumbnailDimensionsState: { width: number; height: number } = this.resolveSize(this.mergedConfigState.thumbnailSize);
  private mergedLabelsState: Required<FilePreviewLabels> = this.buildMergedLabels();
  /**
   * Cached values updated once in refreshDerivedState().
   * Avoids recomputing these on every change-detection pass for each item in the list.
   */
  private hasVisibleActionsState = false;
  private fileActionVisibilityCache: Record<FileActionVisibilityKey, boolean> = {
    previewAction: false,
    downloadAction: false,
    deleteAction: false,
  };
  private visibleCustomActionsState: FilePreviewAction[] = [];

  constructor(
    private readonly filePreviewService: FilePreviewService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    // Populate cached derived state before the first render so the template
    // does not see stale false/empty initial values.
    this.refreshDerivedState();
    this.subscribeToStream();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.config || changes.labels) {
      this.refreshDerivedState();
    }

    if (changes.itemsStream || changes.items) {
      this.itemsSubscription?.unsubscribe();
      this.subscribeToStream();
    }
  }

  ngOnDestroy(): void {
    this.dialogRef?.close();
    this.itemsSubscription?.unsubscribe();
    this.filePreviewService.releaseResources();
  }

  trackById(_: number, item: ResolvedFilePreviewItem): string {
    return item.id;
  }

  trackByActionId(_: number, action: FilePreviewAction): string {
    return action.id;
  }

  get thumbnailDimensions(): { width: number; height: number } {
    return this.thumbnailDimensionsState;
  }

  get mergedConfig(): typeof DEFAULT_FILE_PREVIEW_CONFIG {
    return this.mergedConfigState;
  }

  get mergedLabels(): Required<FilePreviewLabels> {
    return this.mergedLabelsState;
  }

  get visibleCustomActions(): FilePreviewAction[] {
    return this.visibleCustomActionsState;
  }

  get hasVisibleActions(): boolean {
    return this.hasVisibleActionsState;
  }

  formatFileSize(bytes?: number): string {
    return this.filePreviewService.formatFileSize(bytes);
  }

  openPreview(item: ResolvedFilePreviewItem): void {
    if (!this.mergedConfig.showOverlayPreview) {
      return;
    }

    const data: FilePreviewDialogData = {
      item,
      config: this.mergedConfig,
      labels: this.mergedLabels,
      visibleCustomActions: this.visibleCustomActions,
      isDownloadVisible: this.isFileActionVisible('downloadAction'),
      isDeleteVisible: this.isFileActionVisible('deleteAction'),
    };

    this.previewOpened.emit(item);

    this.dialogRef = this.dialog.open<FilePreviewDialogComponent, FilePreviewDialogData, FilePreviewDialogResult>(
      FilePreviewDialogComponent,
      {
        data,
        width: '800px',
        maxWidth: '90vw',
        height: '600px',
        maxHeight: '85vh',
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
    return this.fileActionVisibilityCache[action];
  }

  private subscribeToStream(): void {
    const stream = this.itemsStream ?? (this.items ? of(this.items) : null);

    if (stream && isObservable(stream)) {
      this.itemsSubscription = stream.subscribe({
        next: (items: FilePreviewItem[]) => {
          void this.loadItems(items);
        },
        error: () => {
          this.resolvedItems = [];
          this.retainCurrentObjectUrls();
          this.changeDetectorRef.markForCheck();
        },
      });
    } else {
      void this.loadItems(this.items ?? []);
    }
  }

  private async loadItems(items: FilePreviewItem[]): Promise<void> {
    const requestId = ++this.loadRequestId;
    const keepUrls = new Set<string>();

    // Clear immediately so stale thumbnails don't linger and the empty state shows at once.
    this.resolvedItems = [];
    this.retainCurrentObjectUrls();
    this.changeDetectorRef.markForCheck();

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
        batchResolved = await this.filePreviewService.resolveItems(batch);
      } catch {
        if (requestId !== this.loadRequestId) {
          return;
        }
        // Retain partial results from previous batches and stop further processing.
        this.changeDetectorRef.markForCheck();
        return;
      }
      if (requestId !== this.loadRequestId) {
        return;
      }
      this.resolvedItems.push(...batchResolved);
      this.collectItemUrls(batchResolved, keepUrls);
      this.filePreviewService.retainOnlyObjectUrls(keepUrls);
      this.changeDetectorRef.markForCheck();
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
    this.collectItemUrls(this.resolvedItems, keepUrls);
    this.filePreviewService.retainOnlyObjectUrls(keepUrls);
  }

  private refreshDerivedState(): void {
    this.mergedConfigState = this.buildMergedConfig();
    this.thumbnailDimensionsState = this.resolveSize(this.mergedConfigState.thumbnailSize);
    this.mergedLabelsState = this.buildMergedLabels();
    // Precompute template-bound values so they are not recalculated on every
    // change-detection pass for each item in the rendered list.
    this.visibleCustomActionsState = this.mergedConfigState.actions ?? [];
    this.fileActionVisibilityCache = {
      previewAction: this.computeFileActionVisible('previewAction'),
      downloadAction: this.computeFileActionVisible('downloadAction'),
      deleteAction: this.computeFileActionVisible('deleteAction'),
    };
    this.hasVisibleActionsState = this.computeHasVisibleActions();
  }

  private computeHasVisibleActions(): boolean {
    return (
      this.mergedConfigState.showActionIcons &&
      Boolean(
        (this.mergedConfigState.showOverlayPreview && this.mergedConfigState.showPreviewAction) ||
        this.mergedConfigState.showDownloadAction ||
        this.mergedConfigState.showDeleteAction ||
        this.visibleCustomActionsState.length > 0,
      )
    );
  }

  private computeFileActionVisible(action: FileActionVisibilityKey): boolean {
    if (!this.mergedConfigState.showActionIcons) {
      return false;
    }
    switch (action) {
      case 'previewAction':
        return this.mergedConfigState.showOverlayPreview && this.mergedConfigState.showPreviewAction;
      case 'downloadAction':
        return this.mergedConfigState.showDownloadAction;
      case 'deleteAction':
        return this.mergedConfigState.showDeleteAction;
    }
  }

  private buildMergedConfig(): typeof DEFAULT_FILE_PREVIEW_CONFIG {
    return {
      ...DEFAULT_FILE_PREVIEW_CONFIG,
      ...this.config,
    };
  }

  private buildMergedLabels(): Required<FilePreviewLabels> {
    return {
      ...DEFAULT_FILE_PREVIEW_LABELS,
      ...this.labels,
    };
  }

  private resolveSize(size: ThumbnailSize): { width: number; height: number } {
    if (typeof size === 'object') {
      return size;
    }
    return THUMBNAIL_SIZE_MAP[size] ?? THUMBNAIL_SIZE_MAP.md;
  }
}
