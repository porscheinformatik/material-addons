import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  ViewChild,
  ViewEncapsulation,
  signal,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import {
  FilePreviewAction,
  FilePreviewItem,
  FilePreviewLabels,
  ResolvedFilePreviewConfig,
  ResolvedFilePreviewItem,
} from '../models/file-preview.models';
import { FilePreviewService } from '../services/file-preview.service';
import { PreviewErrorFallbackComponent } from '../components/preview-error-fallback/preview-error-fallback.component';
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
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    PreviewErrorFallbackComponent,
  ],
  providers: [FilePreviewService],
  templateUrl: './file-preview-dialog.component.html',
  styleUrls: ['./file-preview-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class FilePreviewDialogComponent implements AfterViewInit {
  readonly item: ResolvedFilePreviewItem;
  readonly config: ResolvedFilePreviewConfig;
  readonly labels: Required<FilePreviewLabels>;
  readonly visibleCustomActions: FilePreviewAction[];
  readonly isDownloadVisible: boolean;
  readonly isDeleteVisible: boolean;

  protected downloadUrl: string | null = null;
  protected inlinePdfUrl: string | null = null;
  protected isMaximized = false;

  protected readonly renderError = signal<string | null>(null);

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

  download(): void {
    this.filePreviewService.download(this.item);
  }

  triggerDelete(): void {
    this.dialogRef.close({ type: 'delete', item: this.item });
  }

  triggerAction(action: FilePreviewAction): void {
    this.dialogRef.close({ type: 'action', action, item: this.item });
  }

  @ViewChild('docxPreviewHost') docxPreviewHost?: ElementRef<HTMLDivElement>;
  @ViewChild('excelPreviewHost') excelPreviewHost?: ElementRef<HTMLDivElement>;
  @ViewChild('pdfPreviewObject') pdfPreviewObject?: ElementRef<HTMLObjectElement>;

  ngAfterViewInit(): void {
    // Apply responsive dialog sizing
    this.applyDialogSize();

    // Render content based on item type
    if (this.item.kind === 'docx' && this.docxPreviewHost) {
      void this.renderDocx(this.docxPreviewHost.nativeElement, this.item.source);
    } else if (this.item.kind === 'xlsx' && this.excelPreviewHost) {
      void this.renderExcel(this.excelPreviewHost.nativeElement, this.item.source);
    } else if (this.item.kind === 'pdf' && this.pdfPreviewObject) {
      if (this.inlinePdfUrl) {
        this.pdfPreviewObject.nativeElement.setAttribute('data', this.inlinePdfUrl);
      } else {
        this.pdfPreviewObject.nativeElement.removeAttribute('data');
      }
    }
  }

  private async renderDocx(host: HTMLDivElement, source: FilePreviewItem['source']): Promise<void> {
    try {
      await this.filePreviewService.renderDocx(host, source);
    } catch (error) {
      console.error('Failed to render DOCX preview:', error);
      this.renderError.set('DOCX');
    }
  }

  private async renderExcel(host: HTMLDivElement, source: FilePreviewItem['source']): Promise<void> {
    try {
      await this.filePreviewService.renderExcel(host, source, this.config.excelPreviewRowLimit);
    } catch (error) {
      console.error('Failed to render Excel preview:', error);
      this.renderError.set('Excel');
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
