import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatDialogRef } from '@angular/material/dialog';

import {
  DEFAULT_FILE_PREVIEW_CONFIG,
  DEFAULT_FILE_PREVIEW_LABELS,
  FilePreviewAction,
  ResolvedFilePreviewConfig,
  ResolvedFilePreviewItem,
} from '../models/file-preview.models';
import { FilePreviewDialogComponent, FilePreviewDialogData, FilePreviewDialogResult } from './file-preview-dialog.component';
import { FilePreviewService } from '../services/file-preview.service';

describe('FilePreviewDialogComponent (unit)', () => {
  // Kept as a plain mock object (not typed as MatDialogRef) so assertions like
  // `expect(fakeDialogRef.close)` don't trip @typescript-eslint/unbound-method.
  const fakeDialogRef = {
    close: jest.fn(),
    updateSize: jest.fn(),
    addPanelClass: jest.fn(),
    removePanelClass: jest.fn(),
  };

  const fakeDocumentRef = { baseURI: 'https://example.com/' } as Document;

  const fakeSanitizer = {
    bypassSecurityTrustResourceUrl: jest.fn((url: string) => url as SafeResourceUrl),
  } as unknown as DomSanitizer;

  const makeData = (
    overrides: {
      item?: Partial<ResolvedFilePreviewItem>;
      config?: Partial<ResolvedFilePreviewConfig>;
      labels?: Partial<FilePreviewDialogData['labels']>;
      visibleCustomActions?: FilePreviewAction[];
    } = {},
  ): FilePreviewDialogData => ({
    item: {
      id: 'test-item',
      name: 'file.pdf',
      kind: 'pdf',
      extension: 'pdf',
      resolvedPreviewUrl: 'https://example.com/file.pdf',
      ...overrides.item,
    },
    config: { ...DEFAULT_FILE_PREVIEW_CONFIG, ...overrides.config },
    labels: { ...DEFAULT_FILE_PREVIEW_LABELS, ...overrides.labels },
    visibleCustomActions: overrides.visibleCustomActions ?? [],
    isDownloadVisible: true,
    isDeleteVisible: true,
  });

  const createComponent = (data: FilePreviewDialogData, svc: { download: jest.Mock }): FilePreviewDialogComponent =>
    new FilePreviewDialogComponent(
      fakeDialogRef as unknown as MatDialogRef<FilePreviewDialogComponent, FilePreviewDialogResult>,
      data,
      svc as unknown as FilePreviewService,
      fakeDocumentRef,
      fakeSanitizer,
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('close() calls dialogRef.close with null', () => {
    const data = makeData();
    const svc = { download: jest.fn() };
    const comp = createComponent(data, svc);
    comp.close();
    expect(fakeDialogRef.close).toHaveBeenCalledWith(null);
  });

  it('triggerDelete() closes with delete payload', () => {
    const data = makeData();
    const svc = { download: jest.fn() };
    const comp = createComponent(data, svc);
    comp.triggerDelete();
    expect(fakeDialogRef.close).toHaveBeenCalledWith({ type: 'delete', item: comp.item });
  });

  it('triggerAction() closes with action payload', () => {
    const data = makeData();
    const svc = { download: jest.fn() };
    const comp = createComponent(data, svc);
    const action: FilePreviewAction = { id: 'a', icon: 'star', label: 'A' };
    comp.triggerAction(action);
    expect(fakeDialogRef.close).toHaveBeenCalledWith({ type: 'action', action, item: comp.item });
  });

  it('download() delegates to FilePreviewService.download', () => {
    const data = makeData();
    const svc = { download: jest.fn() };
    const comp = createComponent(data, svc);
    comp.download();
    expect(svc.download).toHaveBeenCalledWith(comp.item);
  });

  it('toggleMaximize toggles state and updates dialog size & classes', () => {
    const data = makeData();
    const svc = { download: jest.fn() };
    const comp = createComponent(data, svc);

    comp.toggleMaximize();
    expect(fakeDialogRef.addPanelClass).toHaveBeenCalledWith('fp-mat-dialog--maximized');
    expect(fakeDialogRef.removePanelClass).toHaveBeenCalledWith('fp-mat-dialog--normal');

    comp.toggleMaximize();
    expect(fakeDialogRef.addPanelClass).toHaveBeenCalledWith('fp-mat-dialog--normal');
    expect(fakeDialogRef.removePanelClass).toHaveBeenCalledWith('fp-mat-dialog--maximized');
  });

  it('applies responsive dialog sizing on ngAfterViewInit', () => {
    const data = makeData();
    const svc = { download: jest.fn() };
    const comp = createComponent(data, svc);
    comp.ngAfterViewInit();
    // Verify that dialog panel classes were applied
    expect(fakeDialogRef.addPanelClass).toHaveBeenCalledWith(expect.stringContaining('fp-mat-dialog'));
  });
});
