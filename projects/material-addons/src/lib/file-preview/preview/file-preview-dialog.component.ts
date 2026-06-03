import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
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
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule, MatDialogModule],
  templateUrl: './file-preview-dialog.component.html',
  styleUrls: ['./file-preview-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class FilePreviewDialogComponent {
  readonly item: ResolvedFilePreviewItem;
  readonly labels: Required<FilePreviewLabels>;
  readonly visibleCustomActions: FilePreviewAction[];
  readonly isDownloadVisible: boolean;
  readonly isDeleteVisible: boolean;

  downloadUrl: string | null = null;
  inlinePdfUrl: string | null = null;
  isMaximized = false;

  // Responsive dialog sizing based on viewport width
  private readonly normalSize = this.computeNormalSize();
  private readonly maximizedSize = { width: '100vw', height: '100vh', maxWidth: '100vw', maxHeight: '100vh' };
  private docxRenderPending = false;
  private excelRenderPending = false;

  constructor(
    readonly dialogRef: MatDialogRef<FilePreviewDialogComponent, FilePreviewDialogResult>,
    @Inject(MAT_DIALOG_DATA) data: FilePreviewDialogData,
    private readonly filePreviewService: FilePreviewService,
    private readonly cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) private readonly documentRef: Document | null,
  ) {
    this.item = data.item;
    this.labels = data.labels;
    this.visibleCustomActions = data.visibleCustomActions;
    this.isDownloadVisible = data.isDownloadVisible;
    this.isDeleteVisible = data.isDeleteVisible;

    const safeUrl = this.sanitizeUrl(data.item.resolvedPreviewUrl);
    this.downloadUrl = safeUrl ?? null;
    this.inlinePdfUrl = this.computeInlinePdfUrl(data.item, safeUrl);
    this.docxRenderPending = data.item.kind === 'docx';
    this.excelRenderPending = data.item.kind === 'xlsx';

  }

  /**
   * Compute responsive dialog size based on viewport width
   * - Mobile (<768px): 95vw x 90vh (full screen with small margins)
   * - Tablet (768-1024px): 85vw x 85vh (larger viewport)
   * - Desktop (>1024px): 800px x 600px with maxWidth/maxHeight constraints
   */
  private computeNormalSize(): { width: string; height: string; maxWidth?: string; maxHeight?: string } {
    if (typeof window === 'undefined') {
      // Server-side rendering fallback
      return { width: '800px', height: '600px', maxWidth: '90vw', maxHeight: '85vh' };
    }

    const viewportWidth = window.innerWidth;

    if (viewportWidth < 480) {
      // Small mobile: maximize usage with minimal margins
      return { width: '95vw', height: '90vh', maxWidth: '95vw', maxHeight: '90vh' };
    } else if (viewportWidth < 768) {
      // Mobile/Portrait tablet
      return { width: '90vw', height: '85vh', maxWidth: '90vw', maxHeight: '85vh' };
    } else if (viewportWidth < 1024) {
      // Tablet/Small desktop
      return { width: '80vw', height: '80vh', maxWidth: '80vw', maxHeight: '80vh' };
    } else {
      // Desktop: use fixed dimensions with fallback constraints
      return { width: '800px', height: '600px', maxWidth: '90vw', maxHeight: '85vh' };
    }
  }

  trackByActionId(_: number, action: FilePreviewAction): string {
    return action.id;
  }

  formatFileSize(bytes?: number): string {
    return this.filePreviewService.formatFileSize(bytes);
  }

  getMaximizeLabel(): string {
    return this.isMaximized ? 'Restore' : 'Maximize';
  }

  close(): void {
    this.dialogRef.close(null);
  }

  toggleMaximize(): void {
    this.isMaximized = !this.isMaximized;
    this.applyDialogSize();
  }

  private applyDialogSize(): void {
    const size = this.isMaximized ? this.maximizedSize : this.normalSize;
    this.dialogRef.updateSize(size.width, size.height);
    this.updatePanelClasses();
    this.cdr.markForCheck();
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

  @ViewChild('docxPreviewHost')
  set docxPreviewHostRef(host: ElementRef<HTMLDivElement> | undefined) {
    if (host && this.docxRenderPending && this.item.kind === 'docx') {
      this.docxRenderPending = false;
      void this.renderDocx(host.nativeElement, this.item.source);
    }
  }

  @ViewChild('excelPreviewHost')
  set excelPreviewHostRef(host: ElementRef<HTMLDivElement> | undefined) {
    if (host && this.excelRenderPending && this.item.kind === 'xlsx') {
      this.excelRenderPending = false;
      void this.renderExcel(host.nativeElement, this.item.source);
    }
  }


  @ViewChild('pdfPreviewObject')
  set pdfPreviewObjectRef(host: ElementRef<HTMLObjectElement> | undefined) {
    if (host) {
      if (this.inlinePdfUrl) {
        host.nativeElement.setAttribute('data', this.inlinePdfUrl);
      } else {
        host.nativeElement.removeAttribute('data');
      }
    }
  }

  private async renderDocx(host: HTMLDivElement, source: FilePreviewItem['source']): Promise<void> {
    try {
      await this.filePreviewService.renderDocx(host, source);
    } catch (error) {
      console.error('Failed to render DOCX preview:', error);
      this.renderErrorFallback(host, 'DOCX');
    }
  }

  private async renderExcel(host: HTMLDivElement, source: FilePreviewItem['source']): Promise<void> {
    try {
      await this.filePreviewService.renderExcel(host, source);
    } catch (error) {
      console.error('Failed to render Excel preview:', error);
      this.renderErrorFallback(host, 'Excel');
    }
  }

  private renderErrorFallback(host: HTMLDivElement, fileType: string): void {
    host.innerHTML = `
      <div class="fp-preview-error" role="status">
        <mat-icon>error_outline</mat-icon>
        <p>Unable to render ${fileType} preview</p>
      </div>
    `;
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
