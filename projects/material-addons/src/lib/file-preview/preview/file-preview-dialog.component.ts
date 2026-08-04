import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  signal,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import {
  FilePreviewAction,
  FilePreviewKind,
  FilePreviewLabels,
  ResolvedFilePreviewConfig,
  ResolvedFilePreviewItem,
} from '../models/file-preview.models';
import { FilePreviewService } from '../services/file-preview.service';
import { DocxPreviewComponent } from '../components/docx-preview/docx-preview.component';
import { sanitizeSourceUrl } from '../services/renderers/source-utils';

export interface FilePreviewDialogData {
  item: ResolvedFilePreviewItem;
  config: ResolvedFilePreviewConfig;
  labels: Required<FilePreviewLabels>;
  visibleCustomActions: FilePreviewAction[];
  isDownloadVisible: boolean;
  isDeleteVisible: boolean;
}

export type FilePreviewDialogResult =
  | { type: 'delete'; item: ResolvedFilePreviewItem }
  | { type: 'action'; action: FilePreviewAction; item: ResolvedFilePreviewItem }
  | null;

@Component({
  selector: 'mad-file-preview-dialog',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    DocxPreviewComponent,
  ],
  providers: [FilePreviewService],
  templateUrl: './file-preview-dialog.component.html',
  styleUrls: ['./file-preview-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilePreviewDialogComponent {
  // Signals
  readonly renderError = signal<FilePreviewKind | null>(null);

  // Properties
  readonly item: ResolvedFilePreviewItem;
  readonly config: ResolvedFilePreviewConfig;
  readonly labels: Required<FilePreviewLabels>;
  readonly visibleCustomActions: FilePreviewAction[];
  readonly isDownloadVisible: boolean;
  readonly isDeleteVisible: boolean;

  protected downloadUrl: string | null = null;
  protected inlinePdfUrl: string | null = null;
  protected isMaximized = false;

  constructor(
    readonly dialogRef: MatDialogRef<FilePreviewDialogComponent, FilePreviewDialogResult>,
    @Inject(MAT_DIALOG_DATA) data: FilePreviewDialogData,
    private readonly filePreviewService: FilePreviewService,
    @Inject(DOCUMENT) private readonly documentRef: Document | null,
  ) {
    this.item = data.item;
    this.config = data.config;
    this.labels = data.labels;
    this.visibleCustomActions = data.visibleCustomActions;
    this.isDownloadVisible = data.isDownloadVisible;
    this.isDeleteVisible = data.isDeleteVisible;

    const safeUrl = this.sanitizeUrl(data.item.resolvedPreviewUrl);
    this.downloadUrl = safeUrl ?? null;
    this.inlinePdfUrl = this.computeInlinePdfUrl(data.item, safeUrl);
  }

  trackByActionId(_: number, action: FilePreviewAction): string {
    return action.id;
  }

  formatFileSize(bytes?: number): string {
    return this.filePreviewService.formatFileSize(bytes);
  }

  getMetaIcon(): string {
    switch (this.item.kind) {
      case 'pdf':
        return 'picture_as_pdf';
      case 'docx':
        return 'description';
      case 'image':
        return 'image';
      case 'xlsx':
        return 'table_chart';
      default:
        return 'insert_drive_file';
    }
  }

  getMaximizeLabel(): string {
    return this.isMaximized ? this.labels.restoreActionLabel : this.labels.maximizeActionLabel;
  }

  close(): void {
    this.dialogRef.close(null);
  }

  toggleMaximize(): void {
    this.isMaximized = !this.isMaximized;
    this.applyDialogSize();
  }

  download(): void {
    this.filePreviewService.download(this.item);
  }

  triggerDelete(): void {
    this.dialogRef.close({ type: 'delete', item: this.item });
  }

  triggerAction(action: FilePreviewAction): void {
    this.dialogRef.close({ type: 'action', action, item: this.item });
  }

  ngAfterViewInit(): void {
    // Apply responsive dialog sizing
    this.applyDialogSize();

    // Render PDF if available (other formats are handled by their respective components)
    if (this.item.kind === 'pdf' && this.inlinePdfUrl && this.documentRef) {
      const pdfElement = this.documentRef.querySelector<HTMLObjectElement>(
        '[data-cy="file-preview-pdf-object"]',
      );
      if (pdfElement) {
        pdfElement.setAttribute('data', this.inlinePdfUrl);
      }
    }
  }

  private applyDialogSize(): void {
    this.updatePanelClasses();
  }

  private updatePanelClasses(): void {
    const maximizedClass = 'fp-mat-dialog--maximized';
    const normalClass = 'fp-mat-dialog--normal';
    
    if (this.isMaximized) {
      this.dialogRef.addPanelClass(maximizedClass);
      this.dialogRef.removePanelClass(normalClass);
    } else {
      this.dialogRef.addPanelClass(normalClass);
      this.dialogRef.removePanelClass(maximizedClass);
    }
  }

  private sanitizeUrl(url?: string): string | undefined {
    return url ? sanitizeSourceUrl(url, this.documentRef?.baseURI) : undefined;
  }

  private computeInlinePdfUrl(item: ResolvedFilePreviewItem, safeUrl?: string): string | null {
    if (item.kind !== 'pdf' || !safeUrl) {
      return null;
    }
    if (!safeUrl.startsWith('data:')) {
      return this.isTrustedUrl(safeUrl) ? safeUrl : null;
    }
    return /^data:application\/pdf[;,]/i.test(safeUrl) ? safeUrl : null;
  }

  private isTrustedUrl(url: string): boolean {
    if (url.startsWith('blob:') || url.startsWith('data:')) {
      return true;
    }
    try {
      const baseUrl = this.documentRef?.baseURI;
      if (!baseUrl) {
        return false;
      }
      const parsed = new URL(url, baseUrl);
      const origin = new URL(baseUrl).origin;
      return (parsed.protocol === 'http:' || parsed.protocol === 'https:') && parsed.origin === origin;
    } catch {
      return false;
    }
  }
}
