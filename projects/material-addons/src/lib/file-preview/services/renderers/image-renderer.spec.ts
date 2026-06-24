import { TestBed } from '@angular/core/testing';
import { ImageRenderer } from './image-renderer';

describe('ImageRenderer', () => {
  let r: ImageRenderer;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ImageRenderer] });
    r = TestBed.inject(ImageRenderer);
  });

  it('supports recognizes image mime types and extensions', () => {
    expect(r.supports('image/png', 'png')).toBeTruthy();
    expect(r.supports('image/jpeg', 'jpg')).toBeTruthy();
    expect(r.supports('image/svg+xml', 'svg')).toBeTruthy();
  });

  it('generateThumbnail returns undefined', async () => {
    const res = await r.generateThumbnail(null as any, 'https://example.com/img.png');
    expect(res).toBeUndefined();
  });
});
