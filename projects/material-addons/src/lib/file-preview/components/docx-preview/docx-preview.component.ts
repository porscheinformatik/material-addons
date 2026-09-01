import { Component, input, ViewEncapsulation, inject, signal, AfterViewInit, ElementRef, ChangeDetectionStrategy, effect } from '@angular/core';
import { isPlatformBrowser, NgIf } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

import { FilePreviewItem } from '../../models/file-preview.models';
import { toArrayBuffer } from '../../services/renderers/source-utils';

/**
 * Standalone Angular component for displaying DOCX previews with Shadow DOM encapsulation.
 *
 * Features:
 * - Full-size preview rendering (default): Renders the full DOCX document at normal scale
 * - Thumbnail preview mode: Shows readable content cropped to thumbnail dimensions (like PDF)
 *
 * Responsibilities:
 * 1. Receives DOCX file source as input (required)
 * 2. Renders the DOCX directly into Shadow DOM using docx-preview library
 * 3. Keeps library CSS scoped to the shadow boundary (no global style pollution)
 * 4. Supports thumbnail mode: renders at readable size, container crops to show top portion
 * 5. Handles errors gracefully
 *
 * Thumbnail Strategy:
 * - In thumbnail mode, component renders at full readable size
 * - Container width is set to tile width (e.g., 240px)
 * - overflow: hidden crops the display to show top portion only
 * - Result: readable content preview similar to PDF thumbnails
 *
 * Shadow DOM Strategy:
 * - ViewEncapsulation.ShadowDom ensures docx-preview's styles don't affect the rest of the application
 * - CSS stays scoped to the component instance
 * - Multiple instances don't interfere with each other
 * - Third argument (styleContainer) in renderAsync() ensures styles stay within the shadow root
 */
@Component({
  selector: 'mad-docx-preview',
  template: `
    <div class="docx-preview-host"></div>
  `,
  styleUrls: ['./docx-preview.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.docx-preview--thumbnail]': 'isThumbnail()',
    '[style.--tile-width.px]': 'thumbnail()?.tileWidth || "auto"',
  },
})
export class DocxPreviewComponent implements AfterViewInit {
  /**
   * The DOCX file source to render (URL, Blob, ArrayBuffer, etc.).
   * Required input - component will not render without it.
   */
  readonly source = input.required<FilePreviewItem['source']>();

  /**
   * Thumbnail mode configuration.
   * When provided, renders as a cropped thumbnail showing top portion of document.
   * Set to an object with `tileWidth` to enable thumbnail mode.
   *
   * Example: `{ tileWidth: 240 }` will render at readable size and crop to show top portion.
   * This creates a preview similar to PDF thumbnails - readable content at thumbnail dimensions.
   */
  readonly thumbnail = input<{ tileWidth: number } | null>(null);

  /** Computed signal: true when in thumbnail mode */
  readonly isThumbnail = signal(false);

  private readonly platformId = inject(PLATFORM_ID);
  private readonly hostElement = inject(ElementRef<HTMLElement>);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  constructor() {
    // Update isThumbnail signal when thumbnail input changes
    effect(() => {
      const thumbConfig = this.thumbnail();
      this.isThumbnail.set(thumbConfig !== null);
      // Width is now handled via CSS variable in host binding: [style.--tile-width.px]
    });
  }

  async ngAfterViewInit(): Promise<void> {
    const source = this.source();
    
    if (!this.isBrowser) {
      this.showError();
      return;
    }

    try {
      const host = this.hostElement.nativeElement.shadowRoot?.querySelector('.docx-preview-host') as HTMLElement;
      if (!host) {
        this.showError();
        return;
      }

      const [{ renderAsync }, arrayBuffer] = await Promise.all([
        import('docx-preview'),
        toArrayBuffer(source),
      ]);

      // Render DOCX directly into the shadow host
      // Pass host as third argument (styleContainer) to keep CSS scoped to shadow boundary
      await renderAsync(arrayBuffer, host, host, {
        className: 'docx-preview-document',
        inWrapper: true,
        ignoreWidth: false,
        ignoreHeight: true,
        breakPages: true,
      });

      // In thumbnail mode, keep only the first page and scale it down to fit the tile
      if (this.isThumbnail()) {
        this.applyThumbnailCrop(host);
      }
    } catch (error) {
      console.error('[DocxPreviewComponent] Error rendering DOCX:', error);
      this.showError();
    }
  }

  /**
   * Restrict the rendered DOCX to its first page and scale it down to fit the thumbnail tile.
   *
   * docx-preview renders each page as a <section class="{className}"> inside a
   * <div class="{className}-wrapper">. With className: 'docx-preview-document',
   * pages are `.docx-preview-document-wrapper > .docx-preview-document`.
   *
   * Pages are rendered at their real physical size (e.g. ~816px wide for a Letter page
   * with ~96px margins), which is far larger than a thumbnail tile. Simply cropping with
   * `overflow: hidden` only ever shows the page's blank top margin. Instead, the whole
   * page is visually scaled down with a CSS transform so its actual content is visible.
   */
  private applyThumbnailCrop(host: HTMLElement): void {
    const wrapper = host.querySelector('.docx-preview-document-wrapper') as HTMLElement | null;
    const pages = host.querySelectorAll('.docx-preview-document-wrapper > .docx-preview-document');
    const firstPage = pages[0] as HTMLElement | undefined;

    if (!wrapper || !firstPage) {
      return;
    }

    // Hide all pages except the first one
    for (let i = 1; i < pages.length; i++) {
      (pages[i] as HTMLElement).style.display = 'none';
    }

    // Scale the first page down so it fits the thumbnail tile width
    const tileWidth = this.thumbnail()?.tileWidth;
    const naturalWidth = firstPage.getBoundingClientRect().width || firstPage.offsetWidth;
    if (!tileWidth || !naturalWidth) {
      return;
    }

    const scale = tileWidth / naturalWidth;
    wrapper.style.position = 'absolute';
    wrapper.style.top = '0';
    wrapper.style.left = '0';
    wrapper.style.transform = `scale(${scale})`;
    wrapper.style.transformOrigin = 'top left';
  }

  private showError(): void {
    const host = this.hostElement.nativeElement.shadowRoot?.querySelector('.docx-preview-host') as HTMLElement;
    if (host) {
      host.innerHTML = '';
    }
  }
}
