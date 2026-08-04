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
    } catch (error) {
      console.error('[DocxPreviewComponent] Error rendering DOCX:', error);
      this.showError();
    }
  }

  private showError(): void {
    const host = this.hostElement.nativeElement.shadowRoot?.querySelector('.docx-preview-host') as HTMLElement;
    if (host) {
      host.innerHTML = '';
    }
  }
}
