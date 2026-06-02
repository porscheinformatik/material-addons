import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FilePreviewAction, FilePreviewItem, ResolvedFilePreviewItem } from '../models/file-preview.models';
import { FilePreviewService } from '../services/file-preview.service';
import { FilePreviewComponent } from './file-preview.component';

function makeResolved(partial: Partial<ResolvedFilePreviewItem> = {}): ResolvedFilePreviewItem {
  return {
    id: 'test-1',
    name: 'sample.png',
    mimeType: 'image/png',
    kind: 'image',
    extension: 'png',
    resolvedPreviewUrl: 'data:image/png;base64,abc',
    resolvedThumbnailUrl: 'data:image/png;base64,abc',
    ...partial,
  };
}

describe('FilePreviewComponent', () => {
  let fixture: ComponentFixture<FilePreviewComponent>;
  let component: FilePreviewComponent;
  let serviceStub: jest.Mocked<FilePreviewService>;

  beforeEach(async () => {
    serviceStub = {
      resolveItems: jest.fn(),
      renderDocx: jest.fn(),
      download: jest.fn(),
      formatFileSize: jest.fn(),
      releaseResources: jest.fn(),
      retainOnlyObjectUrls: jest.fn(),
    } as unknown as jest.Mocked<FilePreviewService>;

    serviceStub.resolveItems.mockResolvedValue([makeResolved()]);
    serviceStub.renderDocx.mockResolvedValue(undefined);
    serviceStub.formatFileSize.mockReturnValue('12.3 KB');

    await TestBed.configureTestingModule({
      imports: [FilePreviewComponent, BrowserAnimationsModule],
    })
      .overrideComponent(FilePreviewComponent, {
        set: {
          providers: [{ provide: FilePreviewService, useValue: serviceStub }],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(FilePreviewComponent);
    component = fixture.componentInstance;
  });

  it('creates', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('loads static items on init', fakeAsync(() => {
    const items: FilePreviewItem[] = [
      {
        id: '1',
        name: 'photo.png',
        mimeType: 'image/png',
        source: 'assets/photo.png',
      },
    ];

    component.items = items;
    fixture.detectChanges();
    tick();

    expect(serviceStub.resolveItems).toHaveBeenCalledWith(items);
    expect(component.resolvedItems.length).toBe(1);
  }));

  it('opens overlay preview when enabled', () => {
    const item = makeResolved();
    component.openPreview(item);

    expect(component.selectedItem).toEqual(item);
    expect(component.selectedItemDownloadUrl).toBe('data:image/png;base64,abc');
  });

  it('does not trust unsafe preview urls for overlay bindings', () => {
    component.openPreview(
      makeResolved({
        kind: 'pdf',
        extension: 'pdf',
        mimeType: 'application/pdf',
        resolvedPreviewUrl: 'javascript:alert(1)',
        resolvedThumbnailUrl: undefined,
      }),
    );

    expect(component.selectedItem).toBeTruthy();
    expect(component.selectedItemDownloadUrl).toBeNull();
    expect(component.selectedItemInlinePdfUrl).toBeNull();
  });

  it('trusts validated pdf preview urls for object[data] binding', () => {
    component.openPreview(
      makeResolved({
        kind: 'pdf',
        extension: 'pdf',
        mimeType: 'application/pdf',
        resolvedPreviewUrl: 'data:application/pdf;base64,JVBERi0x',
        resolvedThumbnailUrl: undefined,
      }),
    );

    expect(component.selectedItemDownloadUrl).toBe('data:application/pdf;base64,JVBERi0x');
    expect(component.selectedItemInlinePdfUrl).toBe('data:application/pdf;base64,JVBERi0x');
  });

  it('rejects non-pdf data urls in pdf resource binding', () => {
    component.openPreview(
      makeResolved({
        kind: 'pdf',
        extension: 'pdf',
        mimeType: 'application/pdf',
        resolvedPreviewUrl: 'data:image/png;base64,abc',
        resolvedThumbnailUrl: undefined,
      }),
    );

    expect(component.selectedItemDownloadUrl).toBe('data:image/png;base64,abc');
    expect(component.selectedItemInlinePdfUrl).toBeNull();
  });

  it('rejects cross-origin pdf urls for inline object preview', () => {
    component.openPreview(
      makeResolved({
        kind: 'pdf',
        extension: 'pdf',
        mimeType: 'application/pdf',
        resolvedPreviewUrl: 'https://example.com/remote.pdf',
        resolvedThumbnailUrl: undefined,
      }),
    );

    expect(component.selectedItemDownloadUrl).toBe('https://example.com/remote.pdf');
    expect(component.selectedItemInlinePdfUrl).toBeNull();
  });

  it('renders long overlay file names without hiding header actions', fakeAsync(() => {
    component.config = {
      showOverlayPreview: true,
      showActionIcons: true,
      showDownloadAction: true,
      showDeleteAction: true,
      showPreviewAction: true,
    };

    const longName =
      'very-long-document-name-that-keeps-going-and-going-and-should-wrap-in-the-overlay-header-without-covering-actions.docx';
    component.openPreview(
      makeResolved({
        name: longName,
        kind: 'docx',
        extension: 'docx',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      }),
    );

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const title = (fixture.nativeElement as HTMLElement).querySelector('.fp-overlay__title');
    const actionIcons = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('.fp-overlay__header-actions mat-icon'))
      .map((icon) => icon.textContent?.trim())
      .filter(Boolean);

    expect(title?.textContent).toContain(longName);
    expect(actionIcons).toContain('download');
    expect(actionIcons).toContain('delete');
    expect(actionIcons).toContain('close');
  }));

  it('keeps header actions visible for long pdf file names', fakeAsync(() => {
    component.config = {
      showOverlayPreview: true,
      showActionIcons: true,
      showDownloadAction: true,
      showDeleteAction: true,
      showPreviewAction: true,
    };

    const longPdfName =
      'extremely-long-pdf-file-name-that-should-not-overlap-the-preview-modal-header-actions-even-when-the-name-has-many-segments-and-no-short-breaks-available.pdf';
    component.openPreview(
      makeResolved({
        name: longPdfName,
        kind: 'pdf',
        extension: 'pdf',
        mimeType: 'application/pdf',
        resolvedThumbnailUrl: undefined,
        resolvedPreviewUrl: 'data:application/pdf;base64,JVBERi0x',
      }),
    );

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const title = (fixture.nativeElement as HTMLElement).querySelector('.fp-overlay__title');
    const actionIcons = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('.fp-overlay__header-actions mat-icon'))
      .map((icon) => icon.textContent?.trim())
      .filter(Boolean);

    expect(title?.textContent).toContain(longPdfName);
    expect(actionIcons).toContain('download');
    expect(actionIcons).toContain('delete');
    expect(actionIcons).toContain('close');
  }));

  it('does not open overlay preview when disabled in config', () => {
    component.config = { showOverlayPreview: false };
    fixture.detectChanges();

    component.openPreview(makeResolved());

    expect(component.selectedItem).toBeUndefined();
  });

  it('uses config values and preserves defaults for unspecified fields', () => {
    component.config = {
      showOverlayPreview: false,
      showActionIcons: false,
      showDownloadAction: false,
    };

    fixture.detectChanges();

    expect(component.mergedConfig.showOverlayPreview).toBeFalse();
    expect(component.mergedConfig.showActionIcons).toBeFalse();
    expect(component.mergedConfig.showDownloadAction).toBeFalse();
    expect(component.mergedConfig.showDeleteAction).toBeTrue();
  });

  it('renders built-in action buttons based on current config flags', fakeAsync(() => {
    component.config = {
      showActionIcons: true,
      showPreviewAction: true,
      showDownloadAction: false,
      showDeleteAction: true,
    };
    component.items = [
      {
        id: '1',
        name: 'photo.png',
        mimeType: 'image/png',
        source: 'assets/photo.png',
      },
    ];

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const icons = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('.fp-actions mat-icon'))
      .map((icon) => icon.textContent?.trim())
      .filter(Boolean);

    expect(icons).toEqual(['visibility', 'delete']);
  }));

  it('always exposes custom actions from config.actions', fakeAsync(() => {
    const action: FilePreviewAction = {
      id: 'share',
      icon: 'share',
      label: 'Share',
    };
    component.config = {
      showActionIcons: true,
      actions: [action],
    };
    component.items = [
      {
        id: '1',
        name: 'photo.png',
        mimeType: 'image/png',
        source: 'assets/photo.png',
      },
    ];

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(component.visibleCustomActions).toEqual([action]);

    const icons = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('.fp-actions mat-icon'))
      .map((icon) => icon.textContent?.trim())
      .filter(Boolean);

    expect(icons).toContain('share');
  }));

  it('emits custom action and delete events', () => {
    const action: FilePreviewAction = {
      id: 'share',
      icon: 'share',
      label: 'Share',
    };
    const item = makeResolved();
    const actionSpy = jest.spyOn(component.actionClicked, 'emit');
    const deleteSpy = jest.spyOn(component.deleteClicked, 'emit');

    component.triggerAction(action, item);
    component.triggerDelete(item);

    expect(actionSpy).toHaveBeenCalledWith({ action, item });
    expect(deleteSpy).toHaveBeenCalledWith(item);
  });
});

describe('FilePreviewComponent SSR-safe behavior', () => {
  let fixture: ComponentFixture<FilePreviewComponent>;
  let component: FilePreviewComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilePreviewComponent, BrowserAnimationsModule],
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    }).compileComponents();

    fixture = TestBed.createComponent(FilePreviewComponent);
    component = fixture.componentInstance;
  });

  it('renders a fallback icon for image items without browser object URLs', fakeAsync(() => {
    component.items = [
      {
        id: 'server-image',
        name: 'server.png',
        mimeType: 'image/png',
        source: new Blob(['img'], { type: 'image/png' }),
      },
    ];

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(component.resolvedItems.length).toBe(1);
    expect(component.resolvedItems[0].resolvedPreviewUrl).toBeUndefined();
    expect(component.resolvedItems[0].resolvedThumbnailUrl).toBeUndefined();
    expect((fixture.nativeElement as HTMLElement).querySelector('.fp-thumb__icon-svg--img')).not.toBeNull();
  }));

  it('shows the DOCX server placeholder in overlay preview', fakeAsync(() => {
    component.items = [
      {
        id: 'server-docx',
        name: 'server.docx',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        source: new ArrayBuffer(8),
      },
    ];

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    component.openPreview(component.resolvedItems[0]);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const host = (fixture.nativeElement as HTMLElement).querySelector('.fp-overlay__docx');

    expect(host).not.toBeNull();
    expect(host?.innerHTML).toContain('DOCX preview is only available in the browser.');
  }));
});
