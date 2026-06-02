import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { FilePreviewBase64Input, FilePreviewItem } from '../models/file-preview.models';
import { DocxRenderer } from './renderers/docx-renderer';
import { PdfRenderer } from './renderers/pdf-renderer';
import { FilePreviewService } from './file-preview.service';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeItem(partial: Partial<FilePreviewItem> & Pick<FilePreviewItem, 'id' | 'name'>): FilePreviewItem {
  return partial as FilePreviewItem;
}

// ---------------------------------------------------------------------------
// Spec
// ---------------------------------------------------------------------------

describe('FilePreviewService', () => {
  let service: FilePreviewService;
  let pdfRenderer: PdfRenderer;
  let docxRenderer: DocxRenderer;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [FilePreviewService] });
    service = TestBed.inject(FilePreviewService);
    pdfRenderer = TestBed.inject(PdfRenderer);
    docxRenderer = TestBed.inject(DocxRenderer);
  });

  afterEach(() => {
    service.releaseResources();
  });

  // ── Instantiation ────────────────────────────────────────────────────────

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ── detectKind ───────────────────────────────────────────────────────────

  describe('detectKind()', () => {
    it('returns "image" for image/png MIME type', () => {
      expect(service.detectKind({ mimeType: 'image/png', name: 'file.png' })).toBe('image');
    });

    it('returns "image" for image/jpeg MIME type', () => {
      expect(service.detectKind({ mimeType: 'image/jpeg', name: 'photo.jpg' })).toBe('image');
    });

    it('returns "image" for .jpg extension with generic MIME type', () => {
      expect(
        service.detectKind({
          mimeType: 'application/octet-stream',
          name: 'photo.jpg',
        }),
      ).toBe('image');
    });

    it('returns "image" for .png extension with generic MIME type', () => {
      expect(
        service.detectKind({
          mimeType: 'application/octet-stream',
          name: 'image.png',
        }),
      ).toBe('image');
    });

    it('returns "pdf" for application/pdf MIME type', () => {
      expect(service.detectKind({ mimeType: 'application/pdf', name: 'doc.pdf' })).toBe('pdf');
    });

    it('returns "pdf" for .pdf extension with generic MIME type', () => {
      expect(
        service.detectKind({
          mimeType: 'application/octet-stream',
          name: 'report.pdf',
        }),
      ).toBe('pdf');
    });

    it('returns "docx" for wordprocessingml MIME type', () => {
      expect(
        service.detectKind({
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          name: 'letter.docx',
        }),
      ).toBe('docx');
    });

    it('returns "docx" for .docx extension', () => {
      expect(
        service.detectKind({
          mimeType: 'application/octet-stream',
          name: 'note.docx',
        }),
      ).toBe('docx');
    });

    it('returns "docx" for .odt extension', () => {
      expect(
        service.detectKind({
          mimeType: 'application/octet-stream',
          name: 'notes.odt',
        }),
      ).toBe('docx');
    });

    it('returns "docx" for rtf MIME type', () => {
      expect(service.detectKind({ mimeType: 'application/rtf', name: 'notes.rtf' })).toBe('docx');
    });

    it('returns "docx" for text/plain documents', () => {
      expect(service.detectKind({ mimeType: 'text/plain', name: 'readme.txt' })).toBe('docx');
    });

    it('returns "unknown" for AVIF extension with generic MIME type', () => {
      expect(
        service.detectKind({
          mimeType: 'application/octet-stream',
          name: 'photo.avif',
        }),
      ).toBe('unknown');
    });

    it('returns "unknown" for HEIC extension with generic MIME type', () => {
      expect(
        service.detectKind({
          mimeType: 'application/octet-stream',
          name: 'capture.heic',
        }),
      ).toBe('unknown');
    });

    it('returns "unknown" for unrecognised MIME and extension', () => {
      expect(
        service.detectKind({
          mimeType: 'application/zip',
          name: 'archive.zip',
        }),
      ).toBe('unknown');
    });

    it('handles empty mimeType gracefully', () => {
      expect(service.detectKind({ mimeType: '', name: 'mystery.xyz' })).toBe('unknown');
    });

    it('uses extension fallback when mimeType is omitted', () => {
      expect(service.detectKind({ name: 'report.pdf' })).toBe('pdf');
    });
  });

  // ── isBase64Input ─────────────────────────────────────────────────────────

  describe('isBase64Input()', () => {
    it('returns true for a valid FilePreviewBase64Input object', () => {
      const input: FilePreviewBase64Input = {
        data: 'abc==',
        mimeType: 'image/png',
      };
      expect(service.isBase64Input(input)).toBe(true);
    });

    it('returns false for a plain string', () => {
      expect(service.isBase64Input('data:image/png;base64,abc')).toBe(false);
    });

    it('returns false for a Blob', () => {
      expect(service.isBase64Input(new Blob(['hello']))).toBe(false);
    });

    it('returns false for an ArrayBuffer', () => {
      expect(service.isBase64Input(new ArrayBuffer(4))).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(service.isBase64Input(undefined)).toBe(false);
    });
  });

  // ── resolveItem ──────────────────────────────────────────────────────────

  describe('resolveItem()', () => {
    it('resolves an image item with a data URI source', async () => {
      const item = makeItem({
        id: '1',
        name: 'sample.png',
        mimeType: 'image/png',
        source: 'data:image/png;base64,abc==',
      });

      const resolved = await service.resolveItem(item, false);

      expect(resolved.kind).toBe('image');
      expect(resolved.extension).toBe('png');
      expect(resolved.resolvedPreviewUrl).toBe('data:image/png;base64,abc==');
      // Images use previewUrl as thumbnail
      expect(resolved.resolvedThumbnailUrl).toBe('data:image/png;base64,abc==');
    });

    it('resolves an item by extension when mimeType is omitted', async () => {
      const item = makeItem({
        id: '1b',
        name: 'fallback-image.png',
        source: 'data:image/png;base64,abc==',
      });

      const resolved = await service.resolveItem(item, false);

      expect(resolved.kind).toBe('image');
      expect(resolved.extension).toBe('png');
      expect(resolved.resolvedPreviewUrl).toBe('data:image/png;base64,abc==');
      expect(resolved.resolvedThumbnailUrl).toBe('data:image/png;base64,abc==');
    });

    it('resolves a Base64Input source to a data URI', async () => {
      const item = makeItem({
        id: '2',
        name: 'photo.jpg',
        mimeType: 'image/jpeg',
        source: {
          data: 'abc123',
          mimeType: 'image/jpeg',
        } as FilePreviewBase64Input,
      });

      const resolved = await service.resolveItem(item, false);

      expect(resolved.kind).toBe('image');
      expect(resolved.resolvedPreviewUrl).toBe('data:image/jpeg;base64,abc123');
      expect(resolved.resolvedThumbnailUrl).toBe('data:image/jpeg;base64,abc123');
    });

    it('passes through a pre-formed data URI in Base64Input', async () => {
      const item = makeItem({
        id: '3',
        name: 'photo.jpg',
        mimeType: 'image/jpeg',
        source: {
          data: 'data:image/jpeg;base64,xyz==',
          mimeType: 'image/jpeg',
        } as FilePreviewBase64Input,
      });

      const resolved = await service.resolveItem(item, false);
      expect(resolved.resolvedPreviewUrl).toBe('data:image/jpeg;base64,xyz==');
    });

    it('resolves a PDF item without thumbnail when generatePdfThumbnail is false', async () => {
      const item = makeItem({
        id: '4',
        name: 'report.pdf',
        mimeType: 'application/pdf',
        source: 'data:application/pdf;base64,JVBER',
      });

      const resolved = await service.resolveItem(item, false);

      expect(resolved.kind).toBe('pdf');
      expect(resolved.resolvedPreviewUrl).toBe('data:application/pdf;base64,JVBER');
      expect(resolved.resolvedThumbnailUrl).toBeUndefined();
    });

    it('uses previewUrl when provided, bypassing source resolution', async () => {
      const item = makeItem({
        id: '5',
        name: 'file.png',
        mimeType: 'image/png',
        previewUrl: 'https://cdn.example.com/file.png',
      });

      const resolved = await service.resolveItem(item, false);
      expect(resolved.resolvedPreviewUrl).toBe('https://cdn.example.com/file.png');
    });

    it('blocks unsafe previewUrl schemes and falls back to a safe source', async () => {
      const item = makeItem({
        id: '5b',
        name: 'file.png',
        mimeType: 'image/png',
        previewUrl: 'javascript:alert(1)',
        source: 'https://cdn.example.com/file.png',
      });

      const resolved = await service.resolveItem(item, false);

      expect(resolved.resolvedPreviewUrl).toBe('https://cdn.example.com/file.png');
    });

    it('uses thumbnailUrl when provided, skipping thumbnail generation', async () => {
      const item = makeItem({
        id: '6',
        name: 'doc.pdf',
        mimeType: 'application/pdf',
        thumbnailUrl: 'https://cdn.example.com/thumb.jpg',
      });

      const resolved = await service.resolveItem(item, true);
      expect(resolved.resolvedThumbnailUrl).toBe('https://cdn.example.com/thumb.jpg');
    });

    it('resolves an item without source gracefully', async () => {
      const item = makeItem({
        id: '7',
        name: 'unknown.xyz',
        mimeType: 'application/zip',
      });

      const resolved = await service.resolveItem(item, false);

      expect(resolved.kind).toBe('unknown');
      expect(resolved.resolvedPreviewUrl).toBeUndefined();
      expect(resolved.resolvedThumbnailUrl).toBeUndefined();
    });

    it('returns undefined for unsafe string sources', async () => {
      const item = makeItem({
        id: '7b',
        name: 'unsafe.pdf',
        mimeType: 'application/pdf',
        source: 'javascript:alert(1)',
      });

      const resolved = await service.resolveItem(item, false);

      expect(resolved.resolvedPreviewUrl).toBeUndefined();
      expect(resolved.resolvedThumbnailUrl).toBeUndefined();
    });

    it('creates an object URL for Blob sources', async () => {
      const blob = new Blob(['test'], { type: 'image/png' });
      const item = makeItem({
        id: '8',
        name: 'img.png',
        mimeType: 'image/png',
        source: blob,
      });

      const resolved = await service.resolveItem(item, false);

      expect(resolved.resolvedPreviewUrl).toMatch(/^blob:/);
    });
  });

  // ── resolveItems ─────────────────────────────────────────────────────────

  describe('resolveItems()', () => {
    it('resolves an array of items in parallel', async () => {
      const items: FilePreviewItem[] = [
        makeItem({
          id: 'a',
          name: 'img.png',
          mimeType: 'image/png',
          source: 'data:image/png;base64,abc',
        }),
        makeItem({ id: 'b', name: 'doc.pdf', mimeType: 'application/pdf' }),
        makeItem({
          id: 'c',
          name: 'letter.docx',
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        }),
      ];

      const resolved = await service.resolveItems(items, false);

      expect(resolved.length).toBe(3);
      expect(resolved[0].kind).toBe('image');
      expect(resolved[1].kind).toBe('pdf');
      expect(resolved[2].kind).toBe('docx');
    });

    it('returns an empty array for empty input', async () => {
      const resolved = await service.resolveItems([], false);
      expect(resolved).toEqual([]);
    });
  });

  // ── renderer delegation ───────────────────────────────────────────────────

  describe('renderer delegation', () => {
    it('uses PdfRenderer for PDF thumbnail generation', async () => {
      const pdfSpy = jest.spyOn(pdfRenderer, 'generateThumbnail').mockResolvedValue(new Blob(['thumb'], { type: 'image/jpeg' }));

      const item = makeItem({
        id: 'pdf-1',
        name: 'report.pdf',
        mimeType: 'application/pdf',
        source: 'data:application/pdf;base64,JVBER',
      });

      const resolved = await service.resolveItem(item, true);

      expect(pdfSpy).toHaveBeenCalled();
      expect(resolved.kind).toBe('pdf');
      expect(resolved.resolvedThumbnailUrl).toMatch(/^blob:/);
    });

    it('uses DocxRenderer for DOCX preview rendering', async () => {
      const host = document.createElement('div');
      const docxSpy = jest.spyOn(docxRenderer, 'renderPreview').mockImplementation((target: HTMLElement): Promise<void> => {
        target.innerHTML = '<div>docx-rendered</div>';
        return Promise.resolve();
      });

      await service.renderDocx(host, new ArrayBuffer(8));

      expect(docxSpy).toHaveBeenCalled();
      expect(host.innerHTML).toContain('docx-rendered');
    });

    it('uses DocxRenderer for DOCX thumbnail generation', async () => {
      const docxThumbnailSpy = jest.spyOn(docxRenderer, 'generateThumbnail').mockResolvedValue(new Blob(['thumb'], { type: 'image/jpeg' }));

      const item = makeItem({
        id: 'docx-thumb-1',
        name: 'letter.docx',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        source: new ArrayBuffer(8),
      });

      const resolved = await service.resolveItem(item, false);

      expect(docxThumbnailSpy).toHaveBeenCalled();
      expect(resolved.kind).toBe('docx');
      expect(resolved.resolvedThumbnailUrl).toMatch(/^blob:/);
    });

    it('falls back to undefined thumbnail when DocxRenderer.generateThumbnail returns undefined', async () => {
      jest.spyOn(docxRenderer, 'generateThumbnail').mockResolvedValue(undefined);

      const item = makeItem({
        id: 'docx-thumb-2',
        name: 'letter.docx',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        source: new ArrayBuffer(8),
      });

      const resolved = await service.resolveItem(item, false);

      expect(resolved.kind).toBe('docx');
      expect(resolved.resolvedThumbnailUrl).toBeUndefined();
    });

    it('falls back to undefined thumbnail when DocxRenderer.generateThumbnail throws', async () => {
      jest.spyOn(docxRenderer, 'generateThumbnail').mockRejectedValue(new Error('render failed'));

      const item = makeItem({
        id: 'docx-thumb-3',
        name: 'letter.docx',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        source: new ArrayBuffer(8),
      });

      const resolved = await service.resolveItem(item, false);

      expect(resolved.kind).toBe('docx');
      expect(resolved.resolvedThumbnailUrl).toBeUndefined();
    });

    it('uses pre-supplied thumbnailUrl for DOCX and skips generation', async () => {
      const docxThumbnailSpy = jest.spyOn(docxRenderer, 'generateThumbnail');

      const item = makeItem({
        id: 'docx-thumb-4',
        name: 'letter.docx',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        source: new ArrayBuffer(8),
        thumbnailUrl: 'https://cdn.example.com/docx-thumb.jpg',
      });

      const resolved = await service.resolveItem(item, false);

      expect(docxThumbnailSpy).not.toHaveBeenCalled();
      expect(resolved.resolvedThumbnailUrl).toBe('https://cdn.example.com/docx-thumb.jpg');
    });

    it('keeps image thumbnail flow on image preview URL and does not call PdfRenderer', async () => {
      const pdfSpy = jest.spyOn(pdfRenderer, 'generateThumbnail');

      const item = makeItem({
        id: 'img-1',
        name: 'photo.png',
        mimeType: 'image/png',
        source: 'data:image/png;base64,abc',
      });

      const resolved = await service.resolveItem(item, true);

      expect(resolved.kind).toBe('image');
      expect(resolved.resolvedThumbnailUrl).toBe('data:image/png;base64,abc');
      expect(pdfSpy).not.toHaveBeenCalled();
    });
  });

  // ── formatFileSize ────────────────────────────────────────────────────────

  describe('formatFileSize()', () => {
    it('formats bytes', () => {
      expect(service.formatFileSize(512)).toBe('512 B');
    });

    it('formats kilobytes', () => {
      expect(service.formatFileSize(2048)).toBe('2.0 KB');
    });

    it('formats megabytes', () => {
      expect(service.formatFileSize(3 * 1024 * 1024)).toBe('3.0 MB');
    });

    it('returns empty string for undefined', () => {
      expect(service.formatFileSize(undefined)).toBe('');
    });

    it('returns empty string for negative values', () => {
      expect(service.formatFileSize(-1)).toBe('');
    });
  });

  // ── releaseResources ──────────────────────────────────────────────────────

  describe('releaseResources()', () => {
    it('revokes object URLs without throwing', async () => {
      const blob = new Blob(['data'], { type: 'image/png' });
      const item = makeItem({
        id: 'r1',
        name: 'img.png',
        mimeType: 'image/png',
        source: blob,
      });

      await service.resolveItem(item, false);
      expect(() => service.releaseResources()).not.toThrow();
    });
  });

  describe('download()', () => {
    it('does not click an anchor for unsafe resolvedPreviewUrl values', () => {
      const anchor = document.createElement('a');
      const clickSpy = jest.spyOn(anchor, 'click').mockImplementation(() => {});
      jest.spyOn(document, 'createElement').mockReturnValue(anchor as HTMLElement);

      service.download({
        id: 'dl-1',
        name: 'unsafe.pdf',
        mimeType: 'application/pdf',
        kind: 'pdf',
        extension: 'pdf',
        resolvedPreviewUrl: 'javascript:alert(1)',
      });

      expect(clickSpy).not.toHaveBeenCalled();
    });
  });

  // ── SSR fallbacks ─────────────────────────────────────────────────────────

  describe('SSR-safe behavior', () => {
    let serverService: FilePreviewService;

    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [FilePreviewService, { provide: PLATFORM_ID, useValue: 'server' }],
      });
      serverService = TestBed.inject(FilePreviewService);
    });

    afterEach(() => {
      serverService.releaseResources();
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({ providers: [FilePreviewService] });
      service = TestBed.inject(FilePreviewService);
    });

    it('skips PDF thumbnail generation on the server', async () => {
      const createElementSpy = jest.spyOn(document, 'createElement');

      const thumbnail = await serverService.tryGeneratePdfThumbnail(
        'data:application/pdf;base64,JVBER',
        'data:application/pdf;base64,JVBER',
      );

      expect(thumbnail).toBeUndefined();
      expect(createElementSpy).not.toHaveBeenCalledWith('canvas');
    });

    it('renders a DOCX placeholder on the server', async () => {
      const host = document.createElement('div');

      await serverService.renderDocx(host, new ArrayBuffer(8));

      expect(host.innerHTML).toContain('DOCX preview is only available in the browser.');
    });

    it('skips DOCX thumbnail generation on the server', async () => {
      const thumbnail = await serverService.tryGenerateDocxThumbnail(new ArrayBuffer(8), '');

      expect(thumbnail).toBeUndefined();
    });

    it('does not throw when download is requested on the server', () => {
      expect(() =>
        serverService.download({
          id: 's1',
          name: 'report.pdf',
          mimeType: 'application/pdf',
          kind: 'pdf',
          extension: 'pdf',
          resolvedPreviewUrl: 'https://example.com/report.pdf',
        }),
      ).not.toThrow();
    });

    it('does not create object URLs for Blob sources on the server', async () => {
      const blob = new Blob(['server-side'], { type: 'image/png' });

      const resolved = await serverService.resolveItem(
        makeItem({
          id: 's2',
          name: 'server.png',
          mimeType: 'image/png',
          source: blob,
        }),
        false,
      );

      expect(resolved.resolvedPreviewUrl).toBeUndefined();
      expect(resolved.resolvedThumbnailUrl).toBeUndefined();
    });

    it('cleans up safely on the server without object URL APIs', () => {
      expect(() => serverService.retainOnlyObjectUrls(['blob:test'])).not.toThrow();
      expect(() => serverService.releaseResources()).not.toThrow();
    });
  });
});
