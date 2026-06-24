import { DOCUMENT } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { DocxRenderer } from './docx-renderer';

interface DocxRendererPrivate {
  collectPageText(root: Element): string[];
  findDocxPageRoot(host: HTMLElement): Element;
  sanitizeExtractedText(text: string): string;
  stripCssBlocks(text: string): string;
  stripCssAtRules(text: string): string;
  findAtRuleTerminator(text: string, start: number): number;
  skipBracedBlock(text: string, start: number): number;
  splitIntoLines(text: string, maxLen: number, maxLines: number): string[];
  drawTextThumbnail(lines: string[]): Promise<Blob | undefined>;
}

describe('DocxRenderer', () => {
  describe('browser behavior', () => {
    let renderer: DocxRenderer;
    let documentRef: Document;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [DocxRenderer],
      });

      renderer = TestBed.inject(DocxRenderer);
      documentRef = TestBed.inject(DOCUMENT);
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });

    it('supports configured MIME types and extensions', () => {
      expect(renderer.supports('application/msword', 'doc')).toBe(true);
      expect(renderer.supports('application/octet-stream', 'docx')).toBe(true);
      expect(renderer.supports('application/pdf', 'pdf')).toBe(false);
    });

    it('returns placeholder text lines when extracted content is empty', () => {
      const root = documentRef.createElement('div');
      root.innerHTML = '<style>.x { color: red; }</style><script>alert(1)</script>';

      const lines = (renderer as unknown as DocxRendererPrivate).collectPageText(root);

      expect(lines).toEqual(['DOCX Document']);
    });

    it('collects unique sanitized text from content blocks', () => {
      const root = documentRef.createElement('div');
      root.innerHTML = [
        '<div class="docx-page">',
        '  <p>Hello world</p>',
        '  <p>Hello world</p>',
        '  <li>@media print { hidden }</li>',
        '  <td>font-family: Arial; Visible text</td>',
        '</div>',
      ].join('');

      const lines = (renderer as unknown as DocxRendererPrivate).collectPageText(root);
      const joined = lines.join(' ');

      expect(joined).toContain('Hello world');
      expect(joined).toContain('Visible text');
      expect(joined).not.toContain('@media');
      expect(joined.match(/Hello world/g)?.length).toBe(1);
    });

    it('finds the first matching docx page root and falls back to host', () => {
      const hostWithPage = documentRef.createElement('div');
      hostWithPage.innerHTML = '<div class="docx-wrapper"><section class="docx">Page</section></div>';
      const hostWithoutPage = documentRef.createElement('div');
      hostWithoutPage.textContent = 'fallback';

      expect((renderer as unknown as DocxRendererPrivate).findDocxPageRoot(hostWithPage)?.textContent).toContain('Page');
      expect((renderer as unknown as DocxRendererPrivate).findDocxPageRoot(hostWithoutPage)).toBe(hostWithoutPage);
    });

    it('sanitizes extracted style-heavy text', () => {
      const sanitized = (renderer as unknown as DocxRendererPrivate).sanitizeExtractedText(
        'body { color: red; } @media print { .x { display:none; } } class: hero; Visible   text',
      );

      expect(sanitized).toBe('Visible text');
    });

    it('strips css blocks and at-rules with nested braces', () => {
      expect((renderer as unknown as DocxRendererPrivate).stripCssBlocks('a { color:red; { nested } } b')).toContain('a');
      expect((renderer as unknown as DocxRendererPrivate).stripCssBlocks('a { color:red; { nested } } b')).toContain('b');

      const strippedAtRule = (renderer as unknown as DocxRendererPrivate).stripCssAtRules(
        'before @media screen { .x { color:red; } } after @import url(test.css); end',
      );
      expect(strippedAtRule).toContain('before');
      expect(strippedAtRule).toContain('after');
      expect(strippedAtRule).toContain('end');
      expect(strippedAtRule).not.toContain('@media');
      expect(strippedAtRule).not.toContain('@import');
    });

    it('finds at-rule terminators, skips braced blocks, and splits lines', () => {
      expect((renderer as unknown as DocxRendererPrivate).findAtRuleTerminator('@media screen { x }', 1)).toBeGreaterThan(1);
      expect((renderer as unknown as DocxRendererPrivate).findAtRuleTerminator('@import url(x)', 1)).toBe(-1);
      expect((renderer as unknown as DocxRendererPrivate).skipBracedBlock('{a{b}c}', 1)).toBe(7);
      expect((renderer as unknown as DocxRendererPrivate).splitIntoLines('abcdefgh', 3, 3)).toEqual(['abc', 'def', 'gh']);
    });

    it('draws a text thumbnail blob', async () => {
      const originalCreateElement = documentRef.createElement.bind(documentRef);
      const canvas = originalCreateElement('canvas');
      const context = {
        fillStyle: '',
        font: '',
        fillRect: jest.fn(),
        fillText: jest.fn(),
      } as unknown as CanvasRenderingContext2D;

      jest.spyOn(documentRef, 'createElement').mockImplementation(((tagName: string) => {
        if (tagName === 'canvas') {
          return canvas;
        }
        return originalCreateElement(tagName);
      }) as typeof documentRef.createElement);
      jest.spyOn(canvas, 'getContext').mockReturnValue(context);
      jest.spyOn(canvas, 'toBlob').mockImplementation((callback: BlobCallback) => {
        callback(new Blob(['thumb'], { type: 'image/jpeg' }));
      });

      const blob = await (renderer as unknown as DocxRendererPrivate).drawTextThumbnail(['Line 1', 'Line 2']);

      expect(blob).toEqual(expect.any(Blob));
      expect(context.fillRect).toHaveBeenCalled();
      expect(context.fillText).toHaveBeenCalled();
    });

    it('returns undefined when thumbnail rendering has no source', async () => {
      expect(await renderer.generateThumbnail(undefined)).toBeUndefined();
    });

    it('shows a placeholder when preview source is missing', async () => {
      const host = documentRef.createElement('div');

      await renderer.renderPreview(host, undefined);

      expect(host.innerHTML).toContain('No DOCX source provided.');
    });
  });

  describe('server behavior', () => {
    let renderer: DocxRenderer;
    let documentRef: Document;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [DocxRenderer, { provide: PLATFORM_ID, useValue: 'server' }],
      });

      renderer = TestBed.inject(DocxRenderer);
      documentRef = TestBed.inject(DOCUMENT);
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });

    it('returns undefined for thumbnails on the server', async () => {
      expect(await renderer.generateThumbnail(new ArrayBuffer(8))).toBeUndefined();
    });

    it('renders the server placeholder for preview', async () => {
      const host = documentRef.createElement('div');

      await renderer.renderPreview(host, new ArrayBuffer(8));

      expect(host.innerHTML).toContain('DOCX preview is only available in the browser.');
    });
  });
});
