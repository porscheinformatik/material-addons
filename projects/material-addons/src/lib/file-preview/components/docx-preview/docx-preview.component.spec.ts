/// <reference types="jest" />
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { DocxPreviewComponent } from './docx-preview.component';
import { FilePreviewItem } from '../../models/file-preview.models';

// The mock Blob source used below is not a real docx/zip file, so letting
// docx-preview actually parse it would always reject (JSZip "end of central
// directory" error) and log via console.error asynchronously, sometimes after
// the test/suite has already finished. Mock the library so rendering always
// resolves cleanly and no real parsing occurs.
jest.mock('docx-preview', () => ({
  renderAsync: jest.fn().mockResolvedValue(undefined),
}));

/**
 * Test wrapper component to mount DocxPreviewComponent in TestBed.
 * Allows us to test the component with inputs while maintaining isolation.
 */
@Component({
  selector: 'app-test-host',
  template: `
    <mad-docx-preview
      [source]="source"
      [thumbnail]="thumbnail"
    ></mad-docx-preview>
  `,
  imports: [DocxPreviewComponent],
  standalone: true,
})
class TestHostComponent {
  source: FilePreviewItem['source'] = new Blob(['mock docx content'], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
  thumbnail: { tileWidth: number } | null = null;
}

describe('DocxPreviewComponent', () => {
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;
  let docxComponent: DocxPreviewComponent;
  let componentElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, DocxPreviewComponent],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    componentElement = hostFixture.nativeElement.querySelector('mad-docx-preview');
    docxComponent = hostFixture.debugElement.query(
      (el) => el.componentInstance instanceof DocxPreviewComponent,
    )?.componentInstance as DocxPreviewComponent;

    hostFixture.detectChanges();
    // Wait for the async ngAfterViewInit() rendering to settle before the
    // test body runs.
    await hostFixture.whenStable();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('thumbnail mode', () => {
    it('sets isThumbnail signal to false by default', () => {
      expect(docxComponent.isThumbnail()).toBe(false);
    });

    it('sets isThumbnail signal to true when thumbnail input is provided', async () => {
      hostComponent.thumbnail = { tileWidth: 240 };
      hostFixture.detectChanges();
      await hostFixture.whenStable();

      expect(docxComponent.isThumbnail()).toBe(true);
    });

    it('toggles isThumbnail signal when thumbnail input changes', async () => {
      // Start without thumbnail
      expect(docxComponent.isThumbnail()).toBe(false);

      // Enable thumbnail mode
      hostComponent.thumbnail = { tileWidth: 240 };
      hostFixture.detectChanges();
      await hostFixture.whenStable();
      expect(docxComponent.isThumbnail()).toBe(true);

      // Disable thumbnail mode
      hostComponent.thumbnail = null;
      hostFixture.detectChanges();
      await hostFixture.whenStable();
      expect(docxComponent.isThumbnail()).toBe(false);
    });

    it('applies docx-preview--thumbnail CSS class when in thumbnail mode', async () => {
      hostComponent.thumbnail = { tileWidth: 240 };
      hostFixture.detectChanges();
      await hostFixture.whenStable();

      expect(componentElement.classList.contains('docx-preview--thumbnail')).toBe(true);
    });

    it('removes docx-preview--thumbnail CSS class when exiting thumbnail mode', async () => {
      hostComponent.thumbnail = { tileWidth: 240 };
      hostFixture.detectChanges();
      await hostFixture.whenStable();
      expect(componentElement.classList.contains('docx-preview--thumbnail')).toBe(true);

      hostComponent.thumbnail = null;
      hostFixture.detectChanges();
      await hostFixture.whenStable();
      expect(componentElement.classList.contains('docx-preview--thumbnail')).toBe(false);
    });

    it('sets --tile-width CSS custom property to the thumbnail width value', async () => {
      hostComponent.thumbnail = { tileWidth: 240 };
      hostFixture.detectChanges();
      await hostFixture.whenStable();

      const style = componentElement.getAttribute('style');
      expect(style).toContain('--tile-width');
      expect(style).toContain('240px');
    });

    it('sets --tile-width to auto when not in thumbnail mode', async () => {
      hostComponent.thumbnail = null;
      hostFixture.detectChanges();
      await hostFixture.whenStable();

      const style = componentElement.getAttribute('style');
      expect(style).toContain('--tile-width');
      expect(style).toContain('auto');
    });
  });

  describe('source rendering', () => {
    it('initializes with a valid Blob source without throwing', () => {
      expect(docxComponent).toBeDefined();
    });

    it('creates shadow root for DOM encapsulation', async () => {
      await hostFixture.whenStable();

      const shadowRoot = componentElement.shadowRoot;
      expect(shadowRoot).toBeTruthy();
    });

    it('renders docx-preview-host div in shadow root', async () => {
      await hostFixture.whenStable();

      const shadowRoot = componentElement.shadowRoot;
      const hostDiv = shadowRoot?.querySelector('.docx-preview-host');
      expect(hostDiv).toBeTruthy();
    });
  });

  describe('inputs', () => {
    it('accepts source as required input', () => {
      expect(docxComponent.source).toBeDefined();
      expect(typeof docxComponent.source).toBe('function');
    });

    it('accepts thumbnail as optional input', () => {
      expect(docxComponent.thumbnail).toBeDefined();
      expect(typeof docxComponent.thumbnail).toBe('function');
    });

    it('provides default null value for thumbnail input', () => {
      expect(docxComponent.thumbnail()).toBeNull();
    });
  });
});

