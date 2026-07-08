import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

import { PDF_WORKER_SRC } from '../../pdf-worker-src.token';
import { FilePreviewItem } from '../../models/file-preview.models';
import { BaseRenderer } from './base-renderer';
import { toArrayBuffer } from './source-utils';

interface PdfJsViewport {
  width: number;
  height: number;
}

interface PdfJsRenderTask {
  promise: Promise<void>;
}

interface PdfJsPage {
  getViewport(options: { scale: number }): PdfJsViewport;
  render(params: { canvasContext: CanvasRenderingContext2D; viewport: PdfJsViewport }): PdfJsRenderTask;
  cleanup?(): void;
}

interface PdfJsDocument {
  getPage(pageNumber: number): Promise<PdfJsPage>;
  cleanup?(): void;
  destroy?(): Promise<void>;
}

interface PdfJsLoadingTask {
  promise: Promise<PdfJsDocument>;
  destroy?(): Promise<void>;
}

interface PdfJsModule {
  version: string;
  GlobalWorkerOptions: {
    workerSrc?: string;
  };
  getDocument(params: { data: Uint8Array; disableWorker?: boolean }): PdfJsLoadingTask;
}

@Injectable({ providedIn: 'root' })
/**
 * Renderer for PDF files using the PDF.js library.
 *
 * Features:
 * - Dynamically loads pdfjs-dist library
 * - Generates thumbnails from the first page of the PDF
 * - Supports custom worker source configuration via PDF_WORKER_SRC token
 * - Falls back to main-thread rendering if worker fails (CORS, version mismatch)
 * - Proper resource cleanup to prevent memory leaks
 */
export class PdfRenderer extends BaseRenderer {
  readonly kind = 'pdf' as const;
  readonly priority = 20;

  // ──────────────────────────────────────────────────────────────
  // PDF Rendering Constants
  // ──────────────────────────────────────────────────────────────
  private readonly PDF_FIRST_PAGE_NUMBER = 1;
  private readonly PDF_TARGET_VIEWPORT_WIDTH_PX = 200;
  private readonly PDF_MAX_SCALE = 2;
  private readonly PDF_JPEG_QUALITY = 0.82;
  private readonly supportedTypes = new Set(['application/pdf']);
  private readonly supportedExtensions = new Set(['pdf']);

  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT, { optional: true });
  private readonly pdfWorkerSrc = inject(PDF_WORKER_SRC);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private pdfJsModulePromise?: Promise<PdfJsModule | null>;

  /**
   * Determines if this renderer can handle the given MIME type or file extension.
   * @param mimeType - The MIME type (typically 'application/pdf')
   * @param extension - The file extension (typically 'pdf')
   * @returns True if this renderer supports the file type
   */
  supports(mimeType: string, extension: string): boolean {
    const normalizedMimeType = mimeType.toLowerCase();
    return this.supportedTypes.has(normalizedMimeType) || this.supportedExtensions.has(extension);
  }

  /**
   * Generates a JPEG thumbnail from the first page of the PDF.
   *
   * Process:
   * 1. Loads the pdfjs-dist library dynamically
   * 2. Reads the PDF file from source/URL
   * 3. Renders the first page to a canvas (scaled to ~200px width, max 2x)
   * 4. Exports as JPEG (0.82 quality)
   * 5. Cleans up resources (page, document, loading task)
   *
   * Resilience:
   * - Tries worker-based rendering first
   * - Falls back to main-thread rendering if worker fails
   * - Handles cleanup errors gracefully
   *
   * @param source - The PDF file source (URL, Blob, ArrayBuffer, etc.)
   * @param resolvedUrl - Optional pre-resolved URL for the file
   * @returns A JPEG Blob thumbnail (240x320px recommended), or undefined on failure
   */
  async generateThumbnail(source: FilePreviewItem['source'], resolvedUrl: string): Promise<Blob | undefined> {
    if (!this.isBrowser || !this.document) {
      return undefined;
    }

    let loadingTask: PdfJsLoadingTask | undefined;
    let pdf: PdfJsDocument | undefined;
    let page: PdfJsPage | undefined;
    let canvas: HTMLCanvasElement | undefined;
    try {
      const pdfjs = await this.getPdfJsModule();
      if (!pdfjs) {
        return undefined;
      }

      if (!pdfjs.GlobalWorkerOptions.workerSrc) {
        pdfjs.GlobalWorkerOptions.workerSrc = this.getDefaultPdfWorkerSrc(pdfjs.version);
      }

      const arrayBuffer = await toArrayBuffer(source ?? resolvedUrl);
      const data = new Uint8Array(arrayBuffer);

      // Try with the worker first; if it fails (version mismatch, CORS, network)
      // retry on the main thread so users still get a thumbnail.
      loadingTask = pdfjs.getDocument({ data });
      try {
        pdf = await loadingTask.promise;
      } catch {
        try {
          await loadingTask?.destroy?.();
        } catch {
          // ignore
        }
        loadingTask = pdfjs.getDocument({ data, disableWorker: true });
        pdf = await loadingTask.promise;
      }
      page = await pdf.getPage(this.PDF_FIRST_PAGE_NUMBER);

      const naturalViewport = page.getViewport({ scale: 1 });
      const scale = Math.min(this.PDF_TARGET_VIEWPORT_WIDTH_PX / naturalViewport.width, this.PDF_MAX_SCALE);
      const viewport = page.getViewport({ scale });

      // Create canvas only after we have the page and calculated viewport dimensions
      canvas = this.document.createElement('canvas');
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return undefined;
      }

      await page.render({ canvasContext: ctx, viewport }).promise;

      return await new Promise<Blob | undefined>((resolve) => {
        canvas.toBlob((blob) => resolve(blob ?? undefined), 'image/jpeg', this.PDF_JPEG_QUALITY);
      });
    } catch {
      return undefined;
    } finally {
      try {
        page?.cleanup?.();
      } catch {
        // Best-effort cleanup.
      }
      try {
        pdf?.cleanup?.();
        await pdf?.destroy?.();
      } catch {
        // Best-effort cleanup.
      }
      try {
        await loadingTask?.destroy?.();
      } catch {
        // Best-effort cleanup.
      }
      if (canvas) {
        canvas.width = 0;
        canvas.height = 0;
      }
    }
  }

  /**
   * Gets the PDF.js worker URL to use for rendering.
   *
   * Priority:
   * 1. Custom URL from PDF_WORKER_SRC token (if provided)
   * 2. Versioned CDN URL matching the installed pdfjs-dist version
   *
   * This ensures the worker script matches the library version to prevent incompatibility.
   *
   * @param version - The pdfjs-dist version (e.g., "4.0.0")
   * @returns The worker script URL
   */
  private getDefaultPdfWorkerSrc(version: string): string {
    // If the user provided a custom URL via the PDF_WORKER_SRC token, use it.
    // Otherwise build a versioned CDN URL so the worker matches the installed library.
    return this.pdfWorkerSrc ||
      `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
  }

  /**
   * Dynamically imports and caches the pdfjs-dist module.
   * Uses a single promise to prevent multiple import attempts.
   *
   * @returns The loaded pdfjs-dist module, or null if import fails
   */
  private getPdfJsModule(): Promise<PdfJsModule | null> {
    this.pdfJsModulePromise ??= import('pdfjs-dist' as string).then((module) => module as unknown as PdfJsModule).catch((): null => null);
    return this.pdfJsModulePromise;
  }
}
