import { DOCUMENT } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { PdfRenderer } from './pdf-renderer';

describe('PdfRenderer', () => {
  describe('browser behavior', () => {
    let renderer: PdfRenderer;
    let documentRef: Document;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [PdfRenderer],
      });

      renderer = TestBed.inject(PdfRenderer);
      documentRef = TestBed.inject(DOCUMENT);
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });

    it('supports pdf MIME type and extension', () => {
      expect(renderer.supports('application/pdf', 'pdf')).toBe(true);
      expect(renderer.supports('APPLICATION/PDF', 'txt')).toBe(true);
      expect(renderer.supports('image/png', 'png')).toBe(false);
    });

    it('returns the default CDN worker URL including the pdfjs version', () => {
      const workerUrl = (renderer as any).getDefaultPdfWorkerSrc('4.10.38');
      expect(workerUrl).toContain('cdn.jsdelivr.net');
      expect(workerUrl).toContain('pdfjs-dist@4.10.38');
      expect(workerUrl).toContain('pdf.worker.min.mjs');
    });

    it('caches the pdf.js module promise', async () => {
      const first = (renderer as any).getPdfJsModule();
      const second = (renderer as any).getPdfJsModule();

      expect(first).toBe(second);
      await expect(first).resolves.toBeDefined();
    });

    it('returns undefined when pdf.js is unavailable', async () => {
      jest.spyOn(renderer as any, 'getPdfJsModule').mockResolvedValue(null);

      await expect(renderer.generateThumbnail(new ArrayBuffer(8), 'blob:test')).resolves.toBeUndefined();
    });

    it('renders a thumbnail blob with a pdf.js stub', async () => {
      const originalCreateElement = documentRef.createElement.bind(documentRef);
      const canvas = originalCreateElement('canvas');
      const context = {
        fillRect: jest.fn(),
        fillText: jest.fn(),
      } as unknown as CanvasRenderingContext2D;
      const pageCleanup = jest.fn();
      const pdfCleanup = jest.fn();
      const pdfDestroy = jest.fn().mockResolvedValue();
      const loadingDestroy = jest.fn().mockResolvedValue();
      const renderPromise = Promise.resolve();
      const getPage = jest.fn().mockResolvedValue({
        getViewport: ({ scale }: { scale: number }) => ({
          width: 100 * scale,
          height: 140 * scale,
        }),
        render: jest.fn().mockReturnValue({ promise: renderPromise }),
        cleanup: pageCleanup,
      });
      const getDocument = jest.fn().mockReturnValue({
        promise: Promise.resolve({
          getPage,
          cleanup: pdfCleanup,
          destroy: pdfDestroy,
        }),
        destroy: loadingDestroy,
      });
      const pdfjsStub: {
        version: string;
        GlobalWorkerOptions: { workerSrc?: string };
        getDocument: jest.Mock;
      } = {
        version: 'test',
        GlobalWorkerOptions: {},
        getDocument,
      };

      jest.spyOn(documentRef, 'createElement').mockImplementation(((tagName: string) => {
        if (tagName === 'canvas') {
          return canvas;
        }
        return originalCreateElement(tagName);
      }) as typeof documentRef.createElement);
      jest.spyOn(canvas, 'getContext').mockReturnValue(context);
      jest.spyOn(canvas, 'toBlob').mockImplementation((callback: BlobCallback) => {
        callback(new Blob(['pdf-thumb'], { type: 'image/jpeg' }));
      });
      jest.spyOn(renderer as any, 'getPdfJsModule').mockResolvedValue(pdfjsStub as never);

      const blob = await renderer.generateThumbnail(new ArrayBuffer(16), 'blob:test');

      expect(blob).toEqual(expect.any(Blob));
      expect(getDocument).toHaveBeenCalledTimes(1);
      expect(getPage).toHaveBeenCalledWith(1);
      expect(pdfjsStub.GlobalWorkerOptions.workerSrc).toContain('cdn.jsdelivr.net');
      expect(pdfjsStub.GlobalWorkerOptions.workerSrc).toContain('pdfjs-dist@test');
      expect(pdfjsStub.GlobalWorkerOptions.workerSrc).toContain('pdf.worker.min.mjs');
      expect(pageCleanup).toHaveBeenCalled();
      expect(pdfCleanup).toHaveBeenCalled();
      expect(pdfDestroy).toHaveBeenCalled();
      expect(loadingDestroy).toHaveBeenCalled();
      expect(canvas.width).toBe(0);
      expect(canvas.height).toBe(0);
    });

    it('falls back to disableWorker when the first pdf load fails', async () => {
      const originalCreateElement = documentRef.createElement.bind(documentRef);
      const canvas = originalCreateElement('canvas');
      const context = {} as CanvasRenderingContext2D;
      const successfulLoadingTask = {
        promise: Promise.resolve({
          getPage: jest.fn().mockResolvedValue({
            getViewport: ({ scale }: { scale: number }) => ({
              width: 100 * scale,
              height: 140 * scale,
            }),
            render: jest.fn().mockReturnValue({ promise: Promise.resolve() }),
          }),
        }),
        destroy: jest.fn().mockResolvedValue(undefined),
      };
      const getDocument = jest
        .fn()
        .mockReturnValueOnce({
          promise: Promise.reject(new Error('worker failed')),
          destroy: jest.fn().mockResolvedValue(undefined),
        })
        .mockReturnValueOnce(successfulLoadingTask);

      jest.spyOn(documentRef, 'createElement').mockImplementation(((tagName: string) => {
        if (tagName === 'canvas') {
          return canvas;
        }
        return originalCreateElement(tagName);
      }) as typeof documentRef.createElement);
      jest.spyOn(canvas, 'getContext').mockReturnValue(context);
      jest.spyOn(canvas, 'toBlob').mockImplementation((callback: BlobCallback) => callback(new Blob(['x'])));
      jest.spyOn(renderer as any, 'getPdfJsModule').mockResolvedValue({
        version: 'test',
        GlobalWorkerOptions: { workerSrc: 'preset' },
        getDocument,
      } as never);

      const blob = await renderer.generateThumbnail(new ArrayBuffer(12), 'blob:test');

      expect(blob).toEqual(expect.any(Blob));
      expect((getDocument.mock.calls[1] as [{ disableWorker: boolean }])[0].disableWorker).toBe(true);
    });

    it('returns undefined when no canvas context is available', async () => {
      const originalCreateElement = documentRef.createElement.bind(documentRef);
      const canvas = originalCreateElement('canvas');
      const getDocument = jest.fn().mockReturnValue({
        promise: Promise.resolve({
          getPage: jest.fn().mockResolvedValue({
            getViewport: ({ scale }: { scale: number }) => ({
              width: 100 * scale,
              height: 140 * scale,
            }),
            render: jest.fn().mockReturnValue({ promise: Promise.resolve() }),
          }),
        }),
      });

      jest.spyOn(documentRef, 'createElement').mockImplementation(((tagName: string) => {
        if (tagName === 'canvas') {
          return canvas;
        }
        return originalCreateElement(tagName);
      }) as typeof documentRef.createElement);
      jest.spyOn(canvas, 'getContext').mockReturnValue(null);
      jest.spyOn(renderer as any, 'getPdfJsModule').mockResolvedValue({
        version: 'test',
        GlobalWorkerOptions: { workerSrc: 'preset' },
        getDocument,
      } as never);

      expect(await renderer.generateThumbnail(new ArrayBuffer(12), 'blob:test')).toBeUndefined();
    });
  });

  describe('server behavior', () => {
    let renderer: PdfRenderer;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [PdfRenderer, { provide: PLATFORM_ID, useValue: 'server' }],
      });

      renderer = TestBed.inject(PdfRenderer);
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });

    it('returns undefined for thumbnails on the server', async () => {
      await expect(renderer.generateThumbnail(new ArrayBuffer(8), 'blob:test')).resolves.toBeUndefined();
    });
  });
});
