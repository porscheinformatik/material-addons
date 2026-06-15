import { ChangeDetectorRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { FilePreviewDialogComponent, FilePreviewDialogResult } from './file-preview-dialog.component';
import { FilePreviewService } from '../services/file-preview.service';

describe('FilePreviewDialogComponent (unit)', () => {
  const fakeDialogRef: any = {
    close: jest.fn(),
    updateSize: jest.fn(),
    addPanelClass: jest.fn(),
    removePanelClass: jest.fn(),
  };

  const mockCdr: any = { markForCheck: jest.fn() };

  const makeData = (overrides: any = {}) => ({
    item: {
      name: 'file.pdf',
      kind: 'pdf',
      resolvedPreviewUrl: 'https://example.com/file.pdf',
      source: null,
      ...overrides.item,
    },
    config: { excelPreviewRowLimit: 200, ...overrides.config },
    labels: { maximizeActionLabel: 'Max', restoreActionLabel: 'Restore', ...overrides.labels },
    visibleCustomActions: overrides.visibleCustomActions ?? [],
    isDownloadVisible: true,
    isDeleteVisible: true,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('close() calls dialogRef.close with null', () => {
    const data = makeData();
    const svc: any = { download: jest.fn() };
    const comp = new FilePreviewDialogComponent(fakeDialogRef, data as any, svc as FilePreviewService, mockCdr as ChangeDetectorRef, document as any);
    comp.close();
    expect(fakeDialogRef.close).toHaveBeenCalledWith(null);
  });

  it('triggerDelete() closes with delete payload', () => {
    const data = makeData();
    const svc: any = { download: jest.fn() };
    const comp = new FilePreviewDialogComponent(fakeDialogRef, data as any, svc as FilePreviewService, mockCdr as ChangeDetectorRef, document as any);
    comp.triggerDelete();
    expect(fakeDialogRef.close).toHaveBeenCalledWith({ type: 'delete', item: comp.item });
  });

  it('triggerAction() closes with action payload', () => {
    const data = makeData();
    const svc: any = { download: jest.fn() };
    const comp = new FilePreviewDialogComponent(fakeDialogRef, data as any, svc as FilePreviewService, mockCdr as ChangeDetectorRef, document as any);
    const action = { id: 'a', label: 'A' } as any;
    comp.triggerAction(action);
    expect(fakeDialogRef.close).toHaveBeenCalledWith({ type: 'action', action, item: comp.item });
  });

  it('download() delegates to FilePreviewService.download', () => {
    const data = makeData();
    const svc: any = { download: jest.fn() };
    const comp = new FilePreviewDialogComponent(fakeDialogRef, data as any, svc as FilePreviewService, mockCdr as ChangeDetectorRef, document as any);
    comp.download();
    expect(svc.download).toHaveBeenCalledWith(comp.item);
  });

  it('toggleMaximize toggles state and updates dialog size & classes', () => {
    const data = makeData();
    const svc: any = { download: jest.fn() };
    const comp = new FilePreviewDialogComponent(fakeDialogRef, data as any, svc as FilePreviewService, mockCdr as ChangeDetectorRef, document as any);
    const prev = (comp as any).isMaximized;
    comp.toggleMaximize();
    expect((comp as any).isMaximized).toBe(!prev);
    expect(fakeDialogRef.addPanelClass).toHaveBeenCalled();
    expect(fakeDialogRef.removePanelClass).toHaveBeenCalled();
  });

  it('docxPreviewHost invokes renderDocx during ngAfterViewInit', async () => {
    const data = makeData({ item: { kind: 'docx', source: {} } });
    const svc: any = { download: jest.fn(), renderDocx: jest.fn().mockResolvedValue(undefined) };
    const comp = new FilePreviewDialogComponent(fakeDialogRef, data as any, svc as FilePreviewService, mockCdr as ChangeDetectorRef, document as any);
    // Create a mock host element
    const mockHost = document.createElement('div');
    Object.defineProperty(comp, 'docxPreviewHost', {
      value: { nativeElement: mockHost },
      writable: true,
    });
    // Trigger ngAfterViewInit
    comp.ngAfterViewInit();
    // allow microtask
    await Promise.resolve();
    expect(svc.renderDocx).toHaveBeenCalled();
  });

  it('excelPreviewHost invokes renderExcel during ngAfterViewInit', async () => {
    const data = makeData({ item: { kind: 'xlsx', source: {} } });
    const svc: any = { download: jest.fn(), renderExcel: jest.fn().mockResolvedValue(undefined) };
    const comp = new FilePreviewDialogComponent(fakeDialogRef, data as any, svc as FilePreviewService, mockCdr as ChangeDetectorRef, document as any);
    // Create a mock host element
    const mockHost = document.createElement('div');
    Object.defineProperty(comp, 'excelPreviewHost', {
      value: { nativeElement: mockHost },
      writable: true,
    });
    // Trigger ngAfterViewInit
    comp.ngAfterViewInit();
    await Promise.resolve();
    expect(svc.renderExcel).toHaveBeenCalled();
  });

  it('applies responsive dialog sizing on ngAfterViewInit', () => {
    const data = makeData();
    const svc: any = { download: jest.fn() };
    const comp = new FilePreviewDialogComponent(fakeDialogRef, data as any, svc as FilePreviewService, mockCdr as ChangeDetectorRef, document as any);
    comp.ngAfterViewInit();
    // Verify that dialog panel classes were applied
    expect(fakeDialogRef.addPanelClass).toHaveBeenCalledWith(expect.stringContaining('fp-mat-dialog'));
  });
});
