/// <reference types="jest" />
import { ComponentFixture, TestBed } from '@angular/core/testing';

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

const mockSource: FilePreviewItem['source'] = new Blob(['mock docx content'], {
  type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
});

describe('DocxPreviewComponent', () => {
  let fixture: ComponentFixture<DocxPreviewComponent>;
  let docxComponent: DocxPreviewComponent;
  let componentElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocxPreviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DocxPreviewComponent);
    docxComponent = fixture.componentInstance;
    componentElement = fixture.nativeElement;

    // Required inputs must be set via setInput() before the first detectChanges().
    fixture.componentRef.setInput('source', mockSource);

    fixture.detectChanges();
    // Wait for the async ngAfterViewInit() rendering to settle before the
    // test body runs.
    await fixture.whenStable();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('thumbnail mode', () => {
    it('sets isThumbnail signal to false by default', () => {
      expect(docxComponent.isThumbnail()).toBe(false);
    });

    it('sets isThumbnail signal to true when thumbnail input is provided', async () => {
      fixture.componentRef.setInput('thumbnail', { tileWidth: 240 });
      fixture.detectChanges();
      await fixture.whenStable();

      expect(docxComponent.isThumbnail()).toBe(true);
    });

    it('toggles isThumbnail signal when thumbnail input changes', async () => {
      // Start without thumbnail
      expect(docxComponent.isThumbnail()).toBe(false);

      // Enable thumbnail mode
      fixture.componentRef.setInput('thumbnail', { tileWidth: 240 });
      fixture.detectChanges();
      await fixture.whenStable();
      expect(docxComponent.isThumbnail()).toBe(true);

      // Disable thumbnail mode
      fixture.componentRef.setInput('thumbnail', null);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(docxComponent.isThumbnail()).toBe(false);
    });

    it('applies docx-preview--thumbnail CSS class when in thumbnail mode', async () => {
      fixture.componentRef.setInput('thumbnail', { tileWidth: 240 });
      fixture.detectChanges();
      await fixture.whenStable();

      expect(componentElement.classList.contains('docx-preview--thumbnail')).toBe(true);
    });

    it('removes docx-preview--thumbnail CSS class when exiting thumbnail mode', async () => {
      fixture.componentRef.setInput('thumbnail', { tileWidth: 240 });
      fixture.detectChanges();
      await fixture.whenStable();
      expect(componentElement.classList.contains('docx-preview--thumbnail')).toBe(true);

      fixture.componentRef.setInput('thumbnail', null);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(componentElement.classList.contains('docx-preview--thumbnail')).toBe(false);
    });
  });

  describe('source rendering', () => {
    it('initializes with a valid Blob source without throwing', () => {
      expect(docxComponent).toBeDefined();
    });

    it('creates shadow root for DOM encapsulation', async () => {
      await fixture.whenStable();

      const shadowRoot = componentElement.shadowRoot;
      expect(shadowRoot).toBeTruthy();
    });

    it('renders docx-preview-host div in shadow root', async () => {
      await fixture.whenStable();

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

