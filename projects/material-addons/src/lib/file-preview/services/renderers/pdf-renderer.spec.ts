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

    it('caches the pdf.js module promise', async () => {
      const first = (renderer as any).loadAndCachePdfJsModule();
      const second = (renderer as any).loadAndCachePdfJsModule();

      expect(first).toBe(second);
      await expect(first).resolves.toBeDefined();
    });

    it('returns undefined when pdf.js is unavailable', async () => {
      jest.spyOn(renderer as any, 'loadAndCachePdfJsModule').mockResolvedValue(null);

      await expect(renderer.generateThumbnail(new ArrayBuffer(8), 'blob:test')).resolves.toBeUndefined();
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
