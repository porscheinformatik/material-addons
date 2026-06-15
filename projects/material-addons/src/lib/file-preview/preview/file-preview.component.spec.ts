import { PLATFORM_ID, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

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
    ...(partial as any),
  };
}

function setInput(comp: any, name: string, value: any) {
  const v = comp[name];
  if (v && typeof v.set === 'function') {
    v.set(value);
    return;
  }
  if (typeof v === 'function') {
    comp[name] = signal(value);
    return;
  }
  comp[name] = value;
}

describe('FilePreviewComponent', () => {
  let fixture: ComponentFixture<FilePreviewComponent>;
  let component: FilePreviewComponent;
  let matDialogStub: { open: jest.Mock };
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

    matDialogStub = { open: jest.fn().mockReturnValue({ afterClosed: () => of(null) }) };

    await TestBed.configureTestingModule({
      imports: [FilePreviewComponent, BrowserAnimationsModule, TranslateModule.forRoot()],
      providers: [
        { provide: MatDialog, useValue: matDialogStub },
        TranslateService,
      ],
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

  it('opens preview dialog when enabled', () => {
    const item = makeResolved();
    component.openPreview(item);

    expect(matDialogStub.open).toHaveBeenCalled();
    const call = matDialogStub.open.mock.calls[0];
    expect(call[0]).toBeDefined();
    const dialogConfig = call[1];
    expect(dialogConfig?.data?.item).toEqual(item);
  });

  it('does not open overlay preview when disabled in config', () => {
    setInput(component, 'config', { showOverlayPreview: false });
    fixture.detectChanges();

    component.openPreview(makeResolved());

    expect(matDialogStub.open).not.toHaveBeenCalled();
  });

  it('uses config defaults when fields are unspecified', () => {
    setInput(component, 'config', { showOverlayPreview: false, showActionIcons: false, showDownloadAction: false });
    fixture.detectChanges();

    expect(component.mergedConfig.showOverlayPreview).toBe(false);
    expect(component.mergedConfig.showActionIcons).toBe(false);
    expect(component.mergedConfig.showDownloadAction).toBe(false);
    expect(component.mergedConfig.showDeleteAction).toBe(true);
  });

  it('emits custom action and delete events', () => {
    const action: FilePreviewAction = { id: 'share', icon: 'share', label: 'Share' };
    const item = makeResolved();
    const actionSpy = jest.spyOn(component.actionClicked, 'emit');
    const deleteSpy = jest.spyOn(component.deleteClicked, 'emit');

    component.triggerAction(action, item);
    component.triggerDelete(item);

    expect(actionSpy).toHaveBeenCalledWith({ action, item });
    expect(deleteSpy).toHaveBeenCalledWith(item);
  });
});
