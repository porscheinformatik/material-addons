import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

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
export class PdfRenderer extends BaseRenderer {
  readonly kind = 'pdf' as const;
  readonly priority = 20;
  private readonly supportedTypes = new Set(['application/pdf']);
  private readonly supportedExtensions = new Set(['pdf']);

  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT, { optional: true });
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private pdfJsModulePromise?: Promise<PdfJsModule | null>;

  supports(mimeType: string, extension: string): boolean {
    const normalizedMimeType = mimeType.toLowerCase();
    return this.supportedTypes.has(normalizedMimeType) || this.supportedExtensions.has(extension);
  }

  async generateThumbnail(source: FilePreviewItem['source'], resolvedUrl: string): Promise<Blob | undefined> {
    if (!this.isBrowser || !this.document) {
      return undefined;
    }

    const canvas = this.document.createElement('canvas');
    let loadingTask: PdfJsLoadingTask | undefined;
    let pdf: PdfJsDocument | undefined;
    let page: PdfJsPage | undefined;
    try {
      const pdfjs = await this.getPdfJsModule();
      if (!pdfjs) {
        return undefined;
      }

      if (!pdfjs.GlobalWorkerOptions.workerSrc) {
        pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();
      }

      const arrayBuffer = await toArrayBuffer(source ?? resolvedUrl);
      loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
      pdf = await loadingTask.promise;
      page = await pdf.getPage(1);

      const naturalViewport = page.getViewport({ scale: 1 });
      const scale = Math.min(200 / naturalViewport.width, 2);
      const viewport = page.getViewport({ scale });

      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return undefined;
      }

      await page.render({ canvasContext: ctx, viewport }).promise;

      return await new Promise<Blob | undefined>((resolve) => {
        canvas.toBlob((blob) => resolve(blob ?? undefined), 'image/jpeg', 0.82);
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
      canvas.width = 0;
      canvas.height = 0;
    }
  }

  private getPdfJsModule(): Promise<PdfJsModule | null> {
    this.pdfJsModulePromise ??= import('pdfjs-dist' as string).then((module) => module as unknown as PdfJsModule).catch((): null => null);
    return this.pdfJsModulePromise;
  }
}
