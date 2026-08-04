import { TestBed } from '@angular/core/testing';

import { DocxRenderer } from './docx-renderer';

describe('DocxRenderer', () => {
  let renderer: DocxRenderer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DocxRenderer],
    });

    renderer = TestBed.inject(DocxRenderer);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('supports()', () => {
    it('supports DOCX MIME types', () => {
      expect(renderer.supports('application/vnd.openxmlformats-officedocument.wordprocessingml.document', '')).toBe(true);
      expect(renderer.supports('application/msword', '')).toBe(true);
    });

    it('supports DOCX file extensions', () => {
      expect(renderer.supports('', 'docx')).toBe(true);
      expect(renderer.supports('', 'doc')).toBe(true);
      expect(renderer.supports('', 'odt')).toBe(true);
    });

    it('does not support PDF files', () => {
      expect(renderer.supports('application/pdf', 'pdf')).toBe(false);
    });

    it('does not support unknown files', () => {
      expect(renderer.supports('application/octet-stream', 'bin')).toBe(false);
    });
  });

  describe('kind and priority', () => {
    it('has correct kind', () => {
      expect(renderer.kind).toBe('docx');
    });

    it('has correct priority', () => {
      expect(renderer.priority).toBe(10);
    });
  });
});
