import { TestBed } from '@angular/core/testing';

import { RendererFactoryService } from './renderer-factory.service';
import { PdfRenderer } from './pdf-renderer';
import { DocxRenderer } from './docx-renderer';
import { ImageRenderer } from './image-renderer';

describe('RendererFactoryService', () => {
  let service: RendererFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PdfRenderer, DocxRenderer, ImageRenderer, RendererFactoryService],
    });
    service = TestBed.inject(RendererFactoryService);
  });

  it('getByKind returns defined renderers for known kinds', () => {
    expect(service.getByKind('image')).toBeDefined();
    expect(service.getByKind('pdf')).toBeDefined();
    expect(service.getByKind('docx')).toBeDefined();
  });

  it('getByType selects renderer by mime type and extension', () => {
    const r1 = service.getByType('image/png', 'png');
    expect(r1).toBeDefined();
    expect(r1!.kind).toBe('image');
  });
});
