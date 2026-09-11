import { base64InputToDataUrl, isBase64Input, sanitizeSourceUrl, toArrayBuffer } from './source-utils';

describe('source-utils', () => {
  describe('isBase64Input()', () => {
    it('accepts structured base64 input', () => {
      expect(isBase64Input({ data: 'abc', mimeType: 'image/png' })).toBe(true);
    });

    it('rejects invalid structured input', () => {
      expect(isBase64Input({ data: 123, mimeType: 'image/png' } as never)).toBe(false);
      expect(isBase64Input(new Blob(['x']))).toBe(false);
      expect(isBase64Input(new ArrayBuffer(4))).toBe(false);
    });
  });

  describe('base64InputToDataUrl()', () => {
    it('wraps raw base64 in a data url', () => {
      expect(base64InputToDataUrl({ data: 'abc', mimeType: 'application/pdf' })).toBe('data:application/pdf;base64,abc');
    });

    it('passes through an existing data url', () => {
      expect(
        base64InputToDataUrl({
          data: 'data:image/png;base64,abc',
          mimeType: 'image/png',
        }),
      ).toBe('data:image/png;base64,abc');
    });
  });

  describe('sanitizeSourceUrl()', () => {
    it('allows relative asset paths', () => {
      expect(sanitizeSourceUrl('assets/file.png')).toBe('assets/file.png');
    });

    it('allows supported http, https, and blob urls', () => {
      expect(sanitizeSourceUrl('https://example.com/file.pdf')).toBe('https://example.com/file.pdf');
      expect(sanitizeSourceUrl('http://example.com/file.pdf')).toBe('http://example.com/file.pdf');
      expect(sanitizeSourceUrl('blob:https://example.com/id')).toBe('blob:https://example.com/id');
    });

    it('allows supported data URLs', () => {
      expect(sanitizeSourceUrl('data:application/pdf;base64,JVBERi0x')).toBe('data:application/pdf;base64,JVBERi0x');
    });

    it('trims surrounding whitespace from valid urls', () => {
      expect(sanitizeSourceUrl('  https://example.com/file.pdf  ')).toBe('https://example.com/file.pdf');
    });

    it('blocks javascript URLs', () => {
      expect(sanitizeSourceUrl('javascript:alert(1)')).toBeUndefined();
    });

    it('blocks unsupported data urls and file urls', () => {
      expect(sanitizeSourceUrl('data:text/html,<script>alert(1)</script>')).toBeUndefined();
      expect(sanitizeSourceUrl('file:///C:/secret.pdf')).toBeUndefined();
    });

    it('blocks protocol-relative URLs', () => {
      expect(sanitizeSourceUrl('//evil.example/file.pdf')).toBeUndefined();
    });

    it('blocks empty and invalid urls', () => {
      expect(sanitizeSourceUrl('   ')).toBeUndefined();
      expect(sanitizeSourceUrl('http://exa mple.com')).toBeUndefined();
    });
  });

  describe('toArrayBuffer()', () => {
    it('returns an empty ArrayBuffer for missing source', async () => {
      const result = await toArrayBuffer(undefined);
      expect(result.byteLength).toBe(0);
    });

    it('converts Blob sources without fetch', async () => {
        const blob = new Blob(['hello']);
        // Provide a simple FileReader polyfill in test env if needed
        if (typeof (blob as any).arrayBuffer !== 'function' && typeof FileReader === 'undefined') {
          (global as any).FileReader = class {
            onload: any = null;
            onerror: any = null;
            result: any = null;
            readAsArrayBuffer(b: Blob) {
              // synchronous simple read using Response if available
              if (typeof Response !== 'undefined') {
                new Response(b).arrayBuffer().then((ab) => {
                  this.result = ab;
                  this.onload?.();
                });
              } else {
                this.result = new ArrayBuffer(5);
                this.onload?.();
              }
            }
          } as any;
        }

        const result = await toArrayBuffer(blob);
        expect(result.byteLength).toBeGreaterThan(0);
    });

    it('returns ArrayBuffer sources as-is', async () => {
      const source = new ArrayBuffer(6);
      const result = await toArrayBuffer(source);
      expect(result).toBe(source);
    });

    it('fetches structured base64 inputs as data urls', async () => {
      const fetchSpy = jest.fn().mockResolvedValue({ arrayBuffer: async () => new Uint8Array([1, 2, 3]) });
      (global as any).fetch = fetchSpy;

      const result = await toArrayBuffer({
        data: 'abc',
        mimeType: 'application/pdf',
      });

      expect(fetchSpy).toHaveBeenCalledWith('data:application/pdf;base64,abc');
      expect(result.byteLength).toBeGreaterThan(0);
    });

    it('fetches safe string urls', async () => {
      const fetchSpy = jest.fn().mockResolvedValue({ arrayBuffer: async () => new Uint8Array([1, 2, 3]) });
      (global as any).fetch = fetchSpy;

      const result = await toArrayBuffer('https://example.com/file.pdf');

      expect(fetchSpy).toHaveBeenCalledWith('https://example.com/file.pdf');
      expect(result.byteLength).toBeGreaterThan(0);
    });

    it('rejects unsafe string sources before fetch', async () => {
      await expect(toArrayBuffer('javascript:alert(1)')).rejects.toThrow('Unsafe file preview source URL.');
    });
  });
});
