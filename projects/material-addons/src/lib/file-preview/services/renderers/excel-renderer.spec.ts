import { TestBed } from '@angular/core/testing';

import { ExcelRenderer } from './excel-renderer';

describe('ExcelRenderer', () => {
  let renderer: ExcelRenderer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExcelRenderer],
    });

    renderer = TestBed.inject(ExcelRenderer);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('supports()', () => {
    it('supports Excel MIME types', () => {
      expect(renderer.supports('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', '')).toBe(true);
      expect(renderer.supports('application/vnd.ms-excel', '')).toBe(true);
      expect(renderer.supports('application/vnd.ms-excel.sheet.macroenabled.12', '')).toBe(true);
    });

    it('supports OpenDocument spreadsheet MIME type', () => {
      expect(renderer.supports('application/vnd.oasis.opendocument.spreadsheet', '')).toBe(true);
    });

    it('supports CSV MIME type', () => {
      expect(renderer.supports('application/csv', '')).toBe(true);
    });

    it('supports Excel file extensions', () => {
      expect(renderer.supports('', 'xlsx')).toBe(true);
      expect(renderer.supports('', 'xls')).toBe(true);
      expect(renderer.supports('', 'csv')).toBe(true);
      expect(renderer.supports('', 'ods')).toBe(true);
      expect(renderer.supports('', 'xlsm')).toBe(true);
      expect(renderer.supports('', 'xlsb')).toBe(true);
    });

    it('is case-insensitive for extensions', () => {
      expect(renderer.supports('', 'XLSX')).toBe(true);
      expect(renderer.supports('', 'Xlsx')).toBe(true);
    });

    it('is case-insensitive for MIME types', () => {
      expect(renderer.supports('APPLICATION/VND.OPENXMLFORMATS-OFFICEDOCUMENT.SPREADSHEETML.SHEET', '')).toBe(true);
    });

    it('does not support PDF files', () => {
      expect(renderer.supports('application/pdf', 'pdf')).toBe(false);
    });

    it('does not support DOCX files', () => {
      expect(renderer.supports('application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'docx')).toBe(false);
    });

    it('does not support image files', () => {
      expect(renderer.supports('image/png', 'png')).toBe(false);
    });

    it('does not support unknown files', () => {
      expect(renderer.supports('application/octet-stream', 'bin')).toBe(false);
    });
  });

  describe('kind and priority', () => {
    it('has correct kind', () => {
      expect(renderer.kind).toBe('xlsx');
    });

    it('has correct priority', () => {
      expect(renderer.priority).toBe(15);
    });
  });

  describe('generateThumbnail()', () => {
    it('returns undefined as thumbnails are not supported', async () => {
      const result = await renderer.generateThumbnail(new Blob());
      expect(result).toBeUndefined();
    });
  });
});
