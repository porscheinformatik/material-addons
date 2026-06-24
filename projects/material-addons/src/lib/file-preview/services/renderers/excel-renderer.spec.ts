import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';

import { ExcelRenderer } from './excel-renderer';

describe('ExcelRenderer', () => {
  it('supports recognizes spreadsheet mime types and extensions', () => {
    TestBed.configureTestingModule({ providers: [ExcelRenderer, { provide: PLATFORM_ID, useValue: 'browser' }] });
    const r = TestBed.inject(ExcelRenderer);
    expect(r.supports('text/csv', 'csv')).toBeTruthy();
    expect(r.supports('application/vnd.ms-excel', 'xls')).toBeTruthy();
    expect(r.supports('application/octet-stream', 'xlsx')).toBeTruthy();
  });

  it('generateThumbnail returns undefined when not browser', async () => {
    TestBed.configureTestingModule({ providers: [ExcelRenderer, { provide: PLATFORM_ID, useValue: 'server' }] });
    const r = TestBed.inject(ExcelRenderer);
    const res = await r.generateThumbnail(null as any);
    expect(res).toBeUndefined();
  });

  it('renderPreview shows placeholder when not browser', async () => {
    TestBed.configureTestingModule({ providers: [ExcelRenderer, { provide: PLATFORM_ID, useValue: 'server' }] });
    const r = TestBed.inject(ExcelRenderer);
    const host = { innerHTML: '', classList: { add: jest.fn() }, appendChild: jest.fn() } as any;
    await r.renderPreview(host, null as any);
    expect(host.innerHTML).toContain('Excel preview is only available in the browser.');
  });
});
