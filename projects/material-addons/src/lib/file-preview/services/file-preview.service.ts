import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

import { FilePreviewBase64Input, FilePreviewItem, FilePreviewKind, ResolvedFilePreviewItem } from '../models/file-preview.models';
import { RendererFactoryService } from './renderers/renderer-factory.service';
import { base64InputToDataUrl, isBase64Input as isBase64InputSource, sanitizeSourceUrl } from './renderers/source-utils';

/**
 * Core service for the Material Addons File Preview component.
 *
 * Responsibilities:
 *  - Detecting file kind from MIME type / extension
 *  - Resolving any source format (URL, data URI, Base64 input, Blob, ArrayBuffer) to a URL
 *  - Generating rasterised PDF thumbnails via pdfjs-dist (optional — gracefully falls back to icon)
 *  - Rendering DOCX content via docx-preview in an overlay host element
 *  - Triggering browser file downloads
 *  - Cleaning up blob object URLs on destroy
 */
@Injectable({ providedIn: 'root' })
export class FilePreviewService {
  /** Tracks object URLs created by this service so they can be revoked on destroy. */
  private readonly objectUrls = new Set<string>();
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT, { optional: true });
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly rendererFactory = inject(RendererFactoryService);

  // ------------------------------------------------------------------
  // Public API
  // ------------------------------------------------------------------

  /** Resolves an array of FilePreviewItems in parallel. */
  async resolveItems(items: FilePreviewItem[], generatePdfThumbnail = true): Promise<ResolvedFilePreviewItem[]> {
    if (items.length === 0) {
      return [];
    }

    const maxConcurrent = Math.min(4, items.length);
    const resolved = new Array<ResolvedFilePreviewItem>(items.length);
    let cursor = 0;

    await Promise.all(
      Array.from({ length: maxConcurrent }, async () => {
        while (true) {
          const index = cursor++;
          if (index >= items.length) {
            return;
          }
          resolved[index] = await this.resolveItem(items[index], generatePdfThumbnail);
        }
      }),
    );

    return resolved;
  }

  /**
   * Resolves a single FilePreviewItem:
   *  1. Detects the rendering kind (image / pdf / docx / unknown)
   *  2. Converts the source to a URL usable by <img>, <object>, or fetch
   *  3. Generates a thumbnail URL if none is supplied
   */
  async resolveItem(item: FilePreviewItem, generatePdfThumbnail = true): Promise<ResolvedFilePreviewItem> {
    const kind = this.detectKind(item);
    const resolvedPreviewUrl = this.sanitizeResolvedUrl(item.previewUrl) ?? this.resolveSourceUrl(item.source);

    let resolvedThumbnailUrl = this.sanitizeResolvedUrl(item.thumbnailUrl);
    if (!resolvedThumbnailUrl) {
      if (kind === 'image') {
        // Current image strategy: use resolved preview URL directly as thumbnail.
        resolvedThumbnailUrl = resolvedPreviewUrl;
      } else if (kind === 'pdf' && generatePdfThumbnail && resolvedPreviewUrl) {
        resolvedThumbnailUrl = await this.tryGeneratePdfThumbnail(item.source, resolvedPreviewUrl);
      } else if (kind === 'docx') {
        resolvedThumbnailUrl = await this.tryGenerateDocxThumbnail(item.source, resolvedPreviewUrl ?? '');
      } else if (kind === 'xlsx') {
        resolvedThumbnailUrl = await this.tryGenerateExcelThumbnail(item.source, resolvedPreviewUrl ?? '');
      }
      // Unknown or failed thumbnail generation: component renders icon fallback
    }

    return {
      ...item,
      kind,
      extension: this.getExtension(item.name),
      resolvedPreviewUrl,
      resolvedThumbnailUrl,
    };
  }

  /**
   * Detects the rendering kind from MIME type and/or file extension.
   * Extension-based detection serves as a reliable fallback for
   * scenarios where the MIME type is generic (e.g. 'application/octet-stream').
   */
  detectKind(item: Pick<FilePreviewItem, 'mimeType' | 'name'>): FilePreviewKind {
    const mimeType = item.mimeType?.toLowerCase() ?? '';
    const extension = this.getExtension(item.name);
    return this.rendererFactory.getByType(mimeType, extension)?.kind ?? 'unknown';
  }

  /**
   * Attempts to generate a rasterised first-page thumbnail for a PDF source.
   * Requires `pdfjs-dist` to be installed in the host application.
   * Returns undefined (triggering icon fallback) if the library is absent or rendering fails.
   *
   * To install: npm install pdfjs-dist
   */
  async tryGeneratePdfThumbnail(source: FilePreviewItem['source'], resolvedUrl: string): Promise<string | undefined> {
    if (!this.isBrowser || !this.document) {
      return undefined;
    }

    const pdfRenderer = this.rendererFactory.getByKind('pdf');

    if (!pdfRenderer) {
      return undefined;
    }

    try {
      const blob = await pdfRenderer.generateThumbnail(source, resolvedUrl);
      if (!blob) {
        return undefined;
      }
      return this.createObjectUrl(blob);
    } catch {
      // Rendering failed (corrupted PDF, worker unavailable, etc.) — use icon
      return undefined;
    }
  }

  /**
   * Attempts to generate a thumbnail for a DOCX source.
   * Returns undefined on failure and the UI will fall back to the DOCX icon.
   */
  async tryGenerateDocxThumbnail(source: FilePreviewItem['source'], resolvedUrl: string): Promise<string | undefined> {
    if (!this.isBrowser || !this.document) {
      return undefined;
    }

    const docxRenderer = this.rendererFactory.getByKind('docx');

    if (!docxRenderer) {
      return undefined;
    }

    try {
      const blob = await docxRenderer.generateThumbnail(source, resolvedUrl);
      if (!blob) {
        return undefined;
      }
      return this.createObjectUrl(blob);
    } catch {
      return undefined;
    }
  }

  /**
   * Renders a DOCX source into `host` using docx-preview.
   * Called from the component after the overlay is inserted into the DOM.
   */
  async renderDocx(host: HTMLElement, source: FilePreviewItem['source']): Promise<void> {
    const docxRenderer = this.rendererFactory.getByKind('docx');
    if (!docxRenderer) {
      host.innerHTML = '<div class="docx-placeholder">DOCX renderer is not available.</div>';
      return;
    }
    await docxRenderer.renderPreview(host, source);
  }

   /**
   * Attempts to generate a thumbnail for an Excel source.
   * Returns undefined on failure and the UI will fall back to the XLSX icon.
   */
  async tryGenerateExcelThumbnail(source: FilePreviewItem['source'], resolvedUrl: string): Promise<string | undefined> {
    if (!this.isBrowser || !this.document) {
      return undefined;
    }

    const excelRenderer = this.rendererFactory.getByKind('xlsx');

    if (!excelRenderer) {
      return undefined;
    }

    try {
      const blob = await excelRenderer.generateThumbnail(source, resolvedUrl);
      if (!blob) {
        return undefined;
      }
      return this.createObjectUrl(blob);
    } catch {
      return undefined;
    }
  }

  /**
   * Renders an Excel source into `host` using SheetJS.
   * Called from the component after the overlay is inserted into the DOM.
   */
  async renderExcel(host: HTMLElement, source: FilePreviewItem['source']): Promise<void> {
    const excelRenderer = this.rendererFactory.getByKind('xlsx');
    if (!excelRenderer) {
      host.innerHTML = '<div class="xlsx-placeholder">Excel renderer is not available.</div>';
      return;
    }
    await excelRenderer.renderPreview(host, source);
  }


  /** Triggers a browser download for the resolved file. */
  download(item: ResolvedFilePreviewItem): void {
    const href = this.sanitizeResolvedUrl(item.resolvedPreviewUrl);
    if (!href || !this.isBrowser || !this.document) {
      return;
    }
    const anchor = this.document.createElement('a');
    anchor.href = href;
    anchor.download = item.name;
    anchor.rel = 'noopener';
    anchor.click();
  }

  /**
   * Formats a byte count as a human-readable string (B / KB / MB).
   * Exposed for use in templates and tests.
   */
  formatFileSize(bytes?: number): string {
    if (bytes == null || bytes < 0) {
      return '';
    }
    if (bytes < 1024) {
      return `${bytes} B`;
    }
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  /** Revokes all object URLs created during this service's lifetime. Call on component destroy. */
  releaseResources(): void {
    if (this.canUseObjectUrls()) {
      this.objectUrls.forEach((url) => URL.revokeObjectURL(url));
    }
    this.objectUrls.clear();
  }

  /**
   * Keeps only currently used object URLs and revokes all others.
   * Useful for long-lived components receiving many list updates.
   */
  retainOnlyObjectUrls(urlsToKeep: Iterable<string | undefined>): void {
    if (!this.canUseObjectUrls()) {
      this.objectUrls.clear();
      return;
    }

    const keep = new Set<string>();
    for (const url of urlsToKeep) {
      if (url && this.objectUrls.has(url)) {
        keep.add(url);
      }
    }

    this.objectUrls.forEach((url) => {
      if (!keep.has(url)) {
        URL.revokeObjectURL(url);
        this.objectUrls.delete(url);
      }
    });
  }

  // ------------------------------------------------------------------
  // Private helpers
  // ------------------------------------------------------------------

  /**
   * Converts any accepted source format to a URL string.
   *
   * Accepted forms:
   *  - `string`                → returned as-is (data URI or http/https URL)
   *  - `FilePreviewBase64Input` → assembled into a data URI
   *  - `Blob | File`           → converted to an object URL (tracked for cleanup)
   *  - `ArrayBuffer`           → wrapped in a Blob, then object URL
   */
  resolveSourceUrl(source?: FilePreviewItem['source']): string | undefined {
    if (!source) {
      return undefined;
    }

    // ① Structured Base64 input (e.g. from carCAT backend API)
    if (this.isBase64Input(source)) {
      return this.base64InputToDataUrl(source);
    }

    // ② Plain string — data URI (data:image/png;base64,...) or http/https URL
    if (typeof source === 'string') {
      return this.sanitizeResolvedUrl(source);
    }

    // ③ Blob / File — create a revocable object URL
    if (source instanceof Blob) {
      return this.createObjectUrl(source);
    }

    // ④ ArrayBuffer — wrap in a generic Blob
    const blob = new Blob([source]);
    return this.createObjectUrl(blob);
  }

  /**
   * Type guard for `FilePreviewBase64Input`.
   * Checks for the shape `{ data: string; mimeType: string }`.
   */
  isBase64Input(source: FilePreviewItem['source']): source is FilePreviewBase64Input {
    return isBase64InputSource(source);
  }

  /**
   * Converts a `FilePreviewBase64Input` to a fully qualified data URI.
   * Accepts both raw base64 strings and pre-formed data URIs.
   */
  private base64InputToDataUrl(input: FilePreviewBase64Input): string {
    return base64InputToDataUrl(input);
  }

  private createObjectUrl(blob: Blob): string | undefined {
    if (!this.canUseObjectUrls()) {
      return undefined;
    }

    const objectUrl = URL.createObjectURL(blob);
    this.objectUrls.add(objectUrl);
    return objectUrl;
  }

  private canUseObjectUrls(): boolean {
    return (
      this.isBrowser && typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function' && typeof URL.revokeObjectURL === 'function'
    );
  }

  private sanitizeResolvedUrl(url?: string): string | undefined {
    return url ? sanitizeSourceUrl(url, this.document?.baseURI) : undefined;
  }

  private getExtension(fileName: string): string {
    if (!fileName) {
      return '';
    }
    const parts = fileName.split('.');
    if (parts.length <= 1) {
      return '';
    }

    const partsWithAt = parts as unknown as {
      at(index: number): string | undefined;
    };
    return partsWithAt.at(-1)?.toLowerCase() ?? '';
  }
}
