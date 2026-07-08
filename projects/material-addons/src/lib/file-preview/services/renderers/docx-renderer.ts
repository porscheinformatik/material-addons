import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, EnvironmentInjector, createComponent, Renderer2 } from '@angular/core';

import { FilePreviewItem } from '../../models/file-preview.models';
import { DocxPreviewComponent } from '../../components/docx-preview/docx-preview.component';
import { BaseRenderer } from './base-renderer';
import { toArrayBuffer } from './source-utils';

@Injectable({ providedIn: 'root' })
export class DocxRenderer extends BaseRenderer {
  readonly kind = 'docx' as const;
  readonly priority = 10;

  // ──────────────────────────────────────────────────────────────
  // Thumbnail Canvas Dimensions
  // ──────────────────────────────────────────────────────────────
  /**
   * Thumbnail canvas width: 240px provides a compact preview that fits
   * in file listing sidebars and grid layouts. Standard preview thumbnail size.
   */
  private readonly THUMBNAIL_WIDTH_PX = 240;
  
  /**
   * Thumbnail canvas height: 320px provides a 3:4 aspect ratio (portrait)
   * allowing space for header (28px) + text content + margins while maintaining
   * a compact visual footprint suitable for file previews.
   */
  private readonly THUMBNAIL_HEIGHT_PX = 320;
  
  /**
   * Padding around thumbnail border: 12px creates a visual frame separating
   * the content area from the canvas edge, improving visual hierarchy and spacing.
   */
  private readonly THUMBNAIL_PADDING_PX = 12;

  // ──────────────────────────────────────────────────────────────
  // Off-Screen Rendering Container (for docx-preview library)
  // ──────────────────────────────────────────────────────────────
  /**
   * Off-screen positioning: -10000px ensures the rendering container is
   * far enough left that it won't affect viewport dimensions or trigger
   * horizontal scroll, even with browser chrome/scrollbars.
   */
  private readonly OFF_SCREEN_LEFT_PX = -10000;
  
  /**
   * DOCX render width: 820px approximates a standard letter-size document width
   * (8.5" at typical screen DPI ~96px/inch ≈ 816px), ensuring the rendered
   * document appears at its intended layout before text extraction.
   */
  private readonly DOCX_RENDER_WIDTH_PX = 820;
  
  /**
   * DOCX render height: 1050px approximates a standard letter-size document height
   * (11" at typical screen DPI ~96px/inch ≈ 1056px), allowing full single-page
   * rendering without vertical scroll for most documents.
   */
  private readonly DOCX_RENDER_HEIGHT_PX = 1050;

  // ──────────────────────────────────────────────────────────────
  // Thumbnail Colors
  // ──────────────────────────────────────────────────────────────
  private readonly THUMBNAIL_BACKGROUND_COLOR = '#eef2ff';
  private readonly THUMBNAIL_INNER_BG_COLOR = '#ffffff';
  private readonly THUMBNAIL_HEADER_COLOR = '#2563eb';
  private readonly THUMBNAIL_TEXT_COLOR = '#374151';

  // ──────────────────────────────────────────────────────────────
  // Thumbnail Header Styling
  // ──────────────────────────────────────────────────────────────
  /**
   * Header height: 28px provides visual balance for the "DOCX" label
   * with sufficient padding from border (12px) and space below for text content.
   */
  private readonly THUMBNAIL_HEADER_HEIGHT_PX = 28;
  
  private readonly THUMBNAIL_HEADER_FONT = 'bold 12px Arial, sans-serif';
  
  /**
   * Header text X offset: 22px positions the "DOCX" label with proper margin
   * from the left edge (12px padding + 10px additional spacing for visual alignment).
   */
  private readonly THUMBNAIL_HEADER_X_OFFSET_PX = 22;
  
  /**
   * Header text Y offset: 30px positions the text baseline to center it
   * vertically within the 28px header (accounting for font ascent/descent).
   */
  private readonly THUMBNAIL_HEADER_Y_OFFSET_PX = 30;

  // ──────────────────────────────────────────────────────────────
  // Thumbnail Text Styling
  // ──────────────────────────────────────────────────────────────
  /**
   * Body text font: 11px Arial provides readable text at small thumbnail size
   * while fitting multiple lines within the canvas height.
   */
  private readonly THUMBNAIL_TEXT_FONT = '11px Arial, sans-serif';
  
  /**
   * Text content start Y position: 58px accounts for header (12px padding + 28px header + 18px spacing)
   * providing visual separation between header and body text content.
   */
  private readonly THUMBNAIL_TEXT_START_Y_PX = 58;
  
  /**
   * Text left padding: 20px matches the right padding to center content
   * horizontally within the thumbnail (240px - 2*20px = 200px usable width).
   */
  private readonly THUMBNAIL_TEXT_LEFT_PADDING_PX = 20;
  
  /**
   * Line height: 16px balances readability and content density, providing
   * comfortable spacing between text lines at 11px font size.
   */
  private readonly THUMBNAIL_TEXT_LINE_HEIGHT_PX = 16;
  
  /**
   * Maximum lines that fit in the thumbnail canvas.
   * Calculation: (Canvas height - header - padding - bottom margin) / line height
   * = (320px - 28px header - 24px padding - 20px margin) / 16px = 248px / 16px ≈ 14 lines
   * This ensures text fits within the 320px canvas without clipping.
   */
  private readonly THUMBNAIL_MAX_LINES = 14;
  
  /**
   * Maximum characters per line in thumbnail.
   * Calculation: Canvas width with padding and 11px font
   * = (240px canvas - 40px padding) / 11px font width ≈ 18 chars
   * Using 44 chars based on typical monospace character widths (~5.5px per char at 11px)
   * = 200px usable width / 5.5px per char ≈ 36-44 chars (44 chosen for balance)
   * This ensures text fits horizontally without exceeding canvas width.
   */
  private readonly THUMBNAIL_MAX_CHARS_PER_LINE = 44;

  // ──────────────────────────────────────────────────────────────
  // Thumbnail Export Quality
  // ──────────────────────────────────────────────────────────────
  /**
   * JPEG quality: 0.86 (86%) provides a good balance between file size and visual quality.
   * At this quality, the thumbnail remains clear and readable while keeping
   * file size minimal for efficient caching and transfer.
   */
  private readonly THUMBNAIL_JPEG_QUALITY = 0.86;

  // ──────────────────────────────────────────────────────────────
  // Text Extraction Configuration
  // ──────────────────────────────────────────────────────────────
  private readonly TEXT_EXTRACTION_MAX_CANDIDATES = 18;  // Max meaningful text segments to collect
  private readonly TEXT_EXTRACTION_MIN_LENGTH = 3;       // Minimum characters for a meaningful text segment
  private readonly TEXT_SEPARATOR = ' • ';               // Separator between collected text segments
  private readonly THUMBNAIL_FALLBACK_TEXT = 'DOCX Document';  // Default text if no content found

  // ──────────────────────────────────────────────────────────────
  // Canvas Drawing Configuration
  // ──────────────────────────────────────────────────────────────
  private readonly THUMBNAIL_BOTTOM_MARGIN_PX = 20;  // Margin from bottom where text stops rendering

  // ──────────────────────────────────────────────────────────────
  // Text Sanitization Patterns
  // ──────────────────────────────────────────────────────────────
  private readonly CSS_ROOT_SELECTOR_PATTERN = /^\s*(body|html|:root)\b\s*/i;
  private readonly CSS_PROPERTY_PATTERN = /\b(class|style|font-family|line-height|margin|padding|color|background|display)\b\s*[:=]\s*[^;]+;?/gi;
  private readonly CSS_BRACES_PATTERN = /[{}]/g;

  // ──────────────────────────────────────────────────────────────
  // Docx-Preview Library Selectors
  // ──────────────────────────────────────────────────────────────
  private readonly DOCX_PAGE_ROOT_SELECTORS = ['.docx-page', '.docx-wrapper section.docx', '.docx-wrapper > section', 'section.docx', '.docx-wrapper'];
  private readonly DOCX_BLOCK_ELEMENT_SELECTORS = 'h1, h2, h3, h4, h5, h6, p, li, td, th';
  private readonly DOCX_IGNORED_ELEMENTS = 'style, script, noscript, svg, defs';

  private readonly supportedTypes = new Set([
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-word.document.macroenabled.12',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
    'application/vnd.ms-word.template.macroenabled.12',
    'application/vnd.oasis.opendocument.text',
    'application/rtf',
  ]);
  private readonly supportedExtensions = new Set(['doc', 'docx', 'docm', 'dot', 'dotx', 'dotm', 'odt', 'rtf']);

  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT, { optional: true });
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly renderer = inject(Renderer2, { optional: true });
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  /**
   * Determines if this renderer can handle the given MIME type or file extension.
   * @param mimeType - The MIME type (e.g., 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
   * @param extension - The file extension (e.g., 'docx')
   * @returns True if either the MIME type or extension is supported by this renderer
   */
  supports(mimeType: string, extension: string): boolean {
    const normalizedMimeType = mimeType.toLowerCase();
    return this.supportedTypes.has(normalizedMimeType) || this.supportedExtensions.has(extension);
  }

  /**
   * Generates a JPEG thumbnail for the DOCX file by:
   * 1. Rendering the document to a hidden container using docx-preview library (via Renderer2)
   * 2. Extracting and sanitizing text content from the rendered HTML
   * 3. Drawing the text onto a canvas thumbnail (240x320px)
   *
   * Architecture:
   * - Uses Renderer2 for all DOM manipulation (with fallback for SSR compatibility)
   * - Creates off-screen container via Angular-aware createElement()
   * - Delegates HTML parsing to docx-preview library (browser-only operation)
   * - Uses native Canvas API for thumbnail rendering (Renderer2 doesn't support canvas 2D context)
   *
   * @param source - The DOCX file source (URL, Blob, ArrayBuffer, etc.)
   * @returns A JPEG Blob representing the thumbnail, or undefined if generation fails
   */
  async generateThumbnail(source: FilePreviewItem['source']): Promise<Blob | undefined> {
    if (!this.isBrowser || !this.document || !source) {
      return undefined;
    }

    // Create an off-screen container element via Renderer2 abstraction.
    // This is necessary because the docx-preview library requires a real, live DOM element
    // to render documents into. The library cannot work with virtual/shadow DOM or produce
    // HTML without a DOM context.
    //
    // Using createElement() helper ensures Angular compatibility:
    // - Renderer2 is used when available (normal Angular app context)
    // - Falls back to direct document.createElement() when Renderer2 is unavailable (SSR)
    const host = this.createElement('div');
    this.setStyle(host, 'position', 'fixed');
    this.setStyle(host, 'left', `${this.OFF_SCREEN_LEFT_PX}px`);
    this.setStyle(host, 'top', '0');
    this.setStyle(host, 'width', `${this.DOCX_RENDER_WIDTH_PX}px`);
    this.setStyle(host, 'height', `${this.DOCX_RENDER_HEIGHT_PX}px`);
    this.setStyle(host, 'overflow', 'hidden');
    this.setStyle(host, 'opacity', '0');
    this.setStyle(host, 'pointerEvents', 'none');

    // Append container to DOM via Renderer2 abstraction so docx-preview can render into it.
    // The container is positioned off-screen and hidden to prevent visual flashing or layout shifts.
    this.appendElement(this.document!.body, host);

    try {
      const [{ renderAsync }, arrayBuffer] = await Promise.all([import('docx-preview'), toArrayBuffer(source)]);

      await renderAsync(arrayBuffer, host, undefined, {
        className: 'docx-preview-document',
        inWrapper: true,
        ignoreWidth: false,
        ignoreHeight: true,
        breakPages: true,
      });

      const pageRoot = this.findDocxPageRoot(host);
      if (!pageRoot) {
        return undefined;
      }

      const text = this.collectPageText(pageRoot);
      return await this.drawTextThumbnail(text);
    } catch {
      return undefined;
    } finally {
      // Clean up off-screen container via Renderer2 to prevent memory leaks
      this.removeElement(this.document!.body, host);
    }
  }

  /**
   * Renders a full DOCX preview by:
   * 1. Loading the docx-preview library dynamically
   * 2. Rendering DOCX to a temporary off-screen container (via Renderer2)
   * 3. Extracting the rendered HTML content
   * 4. Creating and injecting the DocxPreviewComponent with the HTML via Angular's createComponent()
   *
   * Architecture:
   * - Off-screen container created via Renderer2 abstraction (Angular-aware)
   * - docx-preview library handles format parsing and HTML rendering
   * - DocxPreviewComponent injected via createComponent() (no direct DOM manipulation)
   * - Proper error handling with fallback error component
   *
   * @param host - The DOM element where the preview will be rendered
   * @param source - The DOCX file source (URL, Blob, ArrayBuffer, etc.)
   */
  override async renderPreview(host: HTMLElement, source: FilePreviewItem['source']): Promise<void> {
    if (!this.isBrowser) {
      this.renderPlaceholder(host, 'DOCX preview is only available in the browser.');
      return;
    }

    if (!source) {
      this.renderPlaceholder(host, 'No DOCX source provided.');
      return;
    }

    try {
      const [{ renderAsync }, arrayBuffer] = await Promise.all([import('docx-preview'), toArrayBuffer(source)]);

      // Create a temporary off-screen container via Renderer2 to render the DOCX document.
      // This is required because the docx-preview library needs a real, live DOM element to render documents.
      // We cannot obtain rendered HTML without providing the library a DOM context.
      // The temporary container is positioned off-screen and hidden to avoid affecting page layout.
      //
      // Using Renderer2 abstraction ensures:
      // - Compatibility with Angular's lifecycle and change detection
      // - Proper cleanup in SSR environments
      // - Framework-aware DOM operations
      const tempContainer = this.createElement('div');
      this.setStyle(tempContainer, 'position', 'fixed');
      this.setStyle(tempContainer, 'left', '-10000px');
      this.setStyle(tempContainer, 'visibility', 'hidden');
      this.setStyle(tempContainer, 'pointerEvents', 'none');
      
      // Append the temporary container to the DOM so docx-preview can render into it.
      // After rendering completes, we extract the HTML content and clean up by removing the container.
      this.appendElement(this.document!.body, tempContainer);

      try {
        // Render DOCX to temporary container via docx-preview library
        await renderAsync(arrayBuffer, tempContainer, undefined, {
          className: 'docx-preview-document',
          inWrapper: true,
          ignoreWidth: false,
          ignoreHeight: true,
          breakPages: true,
        });

        // Extract the rendered HTML from the temporary container
        const htmlContent = tempContainer.innerHTML;

        // Clear host and inject DocxPreviewComponent with the rendered HTML
        // Uses Angular's createComponent() instead of direct DOM manipulation
        this.setProperty(host, 'innerHTML', '');
        const componentRef = createComponent(DocxPreviewComponent, {
          environmentInjector: this.environmentInjector,
        });

        componentRef.setInput('docxHtmlContent', htmlContent);
        componentRef.setInput('isError', false);

        this.appendElement(host, componentRef.location.nativeElement);
        componentRef.changeDetectorRef.detectChanges();
      } finally {
        // Clean up temporary container via Renderer2 to prevent memory leaks
        this.removeElement(this.document!.body, tempContainer);
      }
    } catch (err) {
      console.error('[DocxRenderer.renderPreview] Error:', err);
      
      // Show error state using the component
      this.setProperty(host, 'innerHTML', '');
      const componentRef = createComponent(DocxPreviewComponent, {
        environmentInjector: this.environmentInjector,
      });

      componentRef.setInput('docxHtmlContent', '');
      componentRef.setInput('isError', true);

      this.appendElement(host, componentRef.location.nativeElement);
      componentRef.changeDetectorRef.detectChanges();
    }
  }

  /**
   * Renders a placeholder message using Angular's Renderer2 when available.
   * Used for browser compatibility and source validation messages.
   *
   * Renderer2 Strategy:
   * - Attempts to use Renderer2 for Angular-aware DOM manipulation
   * - Falls back to direct DOM manipulation if Renderer2 is unavailable (SSR environments)
   * - Ensures consistent message presentation regardless of execution context
   *
   * @param host - The container element where the placeholder will be rendered
   * @param message - The message text to display
   */
  private renderPlaceholder(host: HTMLElement, message: string): void {
    if (this.renderer) {
      // Use Renderer2 for Angular-aware DOM operations
      const placeholderDiv = this.renderer.createElement('div');
      this.renderer.addClass(placeholderDiv, 'docx-placeholder');
      this.renderer.setProperty(placeholderDiv, 'textContent', message);
      this.renderer.setProperty(host, 'innerHTML', '');
      this.renderer.appendChild(host, placeholderDiv);
    } else {
      // Fallback to direct DOM when Renderer2 is not available
      const placeholderDiv = this.document!.createElement('div');
      placeholderDiv.className = 'docx-placeholder';
      placeholderDiv.textContent = message;
      host.innerHTML = '';
      host.appendChild(placeholderDiv);
    }
  }

  // ──────────────────────────────────────────────────────────────
  // Renderer2 Abstraction Layer
  // ──────────────────────────────────────────────────────────────
  // These methods provide a consistent abstraction over DOM manipulation
  // that respects Angular's Renderer2 API when available, while falling back
  // to direct DOM access in environments where Renderer2 is unavailable (SSR).
  // ──────────────────────────────────────────────────────────────

  /**
   * Appends a child element to a parent using Renderer2 if available.
   *
   * Renderer2 Strategy:
   * - Uses Renderer2.appendChild() when available (normal Angular context)
   * - Falls back to HTMLElement.appendChild() when Renderer2 is unavailable
   * - Ensures consistent behavior across different execution contexts
   *
   * @param parent - The parent element
   * @param child - The child element to append
   */
  private appendElement(parent: HTMLElement, child: HTMLElement): void {
    if (this.renderer) {
      this.renderer.appendChild(parent, child);
    } else {
      parent.appendChild(child);
    }
  }

  /**
   * Removes a child element from a parent using Renderer2 if available.
   *
   * Renderer2 Strategy:
   * - Uses Renderer2.removeChild() when available (normal Angular context)
   * - Falls back to HTMLElement.removeChild() when Renderer2 is unavailable
   *
   * @param parent - The parent element
   * @param child - The child element to remove
   */
  private removeElement(parent: HTMLElement, child: HTMLElement): void {
    if (this.renderer) {
      this.renderer.removeChild(parent, child);
    } else {
      parent.removeChild(child);
    }
  }

  /**
   * Creates an HTMLElement using Renderer2 if available.
   *
   * Renderer2 Strategy:
   * - Uses Renderer2.createElement() when available (normal Angular context)
   * - Falls back to document.createElement() when Renderer2 is unavailable
   * - Returns a native HTMLElement in both cases
   *
   * @param tagName - The tag name of the element to create (e.g., 'div', 'span')
   * @returns The created element
   */
  private createElement(tagName: string): HTMLElement {
    if (this.renderer) {
      return this.renderer.createElement(tagName) as HTMLElement;
    } else {
      return this.document!.createElement(tagName);
    }
  }

  /**
   * Sets inline styles on an element using Renderer2 if available.
   *
   * Renderer2 Strategy:
   * - Uses Renderer2.setStyle() when available (normal Angular context)
   * - Falls back to direct style manipulation when Renderer2 is unavailable
   * - Handles kebab-case to camelCase conversion for fallback
   *
   * @param element - The element to style
   * @param styleName - The style property name (e.g., 'pointer-events', 'background-color')
   * @param styleValue - The style value (e.g., 'none', '#fff')
   */
  private setStyle(element: HTMLElement, styleName: string, styleValue: string): void {
    if (this.renderer) {
      this.renderer.setStyle(element, styleName, styleValue);
    } else {
      (element.style as any)[this.toCamelCase(styleName)] = styleValue;
    }
  }

  /**
   * Sets a property on an element using Renderer2 if available.
   *
   * Renderer2 Strategy:
   * - Uses Renderer2.setProperty() when available (normal Angular context)
   * - Falls back to direct property assignment when Renderer2 is unavailable
   * - Handles special properties like 'innerHTML' and 'textContent' consistently
   *
   * @param element - The element to set the property on
   * @param propertyName - The property name (e.g., 'innerHTML', 'textContent', 'value')
   * @param propertyValue - The property value
   */
  private setProperty(element: HTMLElement, propertyName: string, propertyValue: any): void {
    if (this.renderer) {
      this.renderer.setProperty(element, propertyName, propertyValue);
    } else {
      (element as any)[propertyName] = propertyValue;
    }
  }

  /**
   * Converts a kebab-case style name to camelCase for direct DOM manipulation.
   * Example: 'pointer-events' -> 'pointerEvents'
   * @param kebabCase - The kebab-case string
   * @returns The camelCase version
   */
  private toCamelCase(kebabCase: string): string {
    return kebabCase.replace(/-(.)/g, (_, char) => char.toUpperCase());
  }

  /**
   * Locates the root container element of the rendered DOCX document.
   * Tries multiple common selectors used by the docx-preview library.
   * @param host - The container element where DOCX was rendered
   * @returns The page root element, or the host itself if no specific root is found
   */
  private findDocxPageRoot(host: HTMLElement): HTMLElement | null {
    for (const selector of this.DOCX_PAGE_ROOT_SELECTORS) {
      const match = host.querySelector<HTMLElement>(selector);
      if (match) {
        return match;
      }
    }

    return host;
  }

  /**
   * Extracts text content from the rendered DOCX document for thumbnail generation.
   * Collects up to 18 unique meaningful text segments from block elements and text nodes.
   * Deduplicates and sanitizes CSS/styling noise from the extracted text.
   * @param root - The root container of the rendered DOCX document
   * @returns An array of text strings suitable for display in a thumbnail (max 14 lines)
   */
  private collectPageText(root: HTMLElement): string[] {
    const clone = root.cloneNode(true) as HTMLElement;

    // Remove non-content nodes that can leak CSS selectors/class names into text extraction.
    clone.querySelectorAll(this.DOCX_IGNORED_ELEMENTS).forEach((node) => node.remove());

    // Track already-seen text to avoid duplicates across different extraction methods.
    const seen = new Set<string>();

    // Collect text segments from block elements and text nodes.
    // Using pure functions (return values instead of side effects) for clarity.
    const blockCandidates = this.collectBlockElementText(clone, this.DOCX_BLOCK_ELEMENT_SELECTORS, seen);
    const textNodeCandidates = this.collectTextNodeContent(clone, seen);
    const candidates = [...blockCandidates, ...textNodeCandidates];

    if (candidates.length === 0) {
      const fallback = this.sanitizeExtractedText(clone.textContent ?? '');
      if (!fallback) {
        return [this.THUMBNAIL_FALLBACK_TEXT];
      }
      return this.splitIntoLines(fallback, this.THUMBNAIL_MAX_CHARS_PER_LINE, this.THUMBNAIL_MAX_LINES);
    }

    const joined = candidates.join(this.TEXT_SEPARATOR);
    return this.splitIntoLines(joined, this.THUMBNAIL_MAX_CHARS_PER_LINE, this.THUMBNAIL_MAX_LINES);
  }

  /**
   * Collects text from block-level HTML elements (h1-h6, p, li, td, th).
   * Avoids collecting duplicate text from nested elements by skipping descendants.
   * Only processes top-level block elements to extract semantically important content.
   * Pure function: returns collected text without side effects.
   * @param root - The root element to search
   * @param blockSelectors - CSS selectors for block elements to collect from
   * @param seen - Set tracking already-collected text to avoid duplicates (updated in-place for deduplication)
   * @returns Array of unique, sanitized text strings from block elements
   */
  private collectBlockElementText(root: HTMLElement, blockSelectors: string, seen: Set<string>): string[] {
    const candidates: string[] = [];
    for (const el of Array.from(root.querySelectorAll<HTMLElement>(blockSelectors))) {
      // Skip if this element is a descendant of another matched block to avoid nesting duplicates.
      if (el.parentElement?.closest(blockSelectors)) {
        continue;
      }

      const text = this.sanitizeExtractedText(el.textContent ?? '');
      if (text.length >= this.TEXT_EXTRACTION_MIN_LENGTH && !seen.has(text)) {
        seen.add(text);
        candidates.push(text);
      }
      if (candidates.length >= this.TEXT_EXTRACTION_MAX_CANDIDATES) {
        break;
      }
    }
    return candidates;
  }

  /**
   * Collects text from text nodes throughout the entire document.
   * Uses TreeWalker to iterate all text nodes, capturing content that isn't in block elements.
   * Supplements block element collection with any text that lives outside structural elements.
   * Pure function: returns collected text without side effects.
   * @param root - The root element to walk
   * @param seen - Set tracking already-collected text to avoid duplicates (updated in-place for deduplication)
   * @returns Array of unique, sanitized text strings from text nodes
   */
  private collectTextNodeContent(root: HTMLElement, seen: Set<string>): string[] {
    const candidates: string[] = [];
    const walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let textNode = walker.nextNode();

    while (textNode) {
      const text = this.sanitizeExtractedText(textNode.textContent ?? '');
      if (text.length >= this.TEXT_EXTRACTION_MIN_LENGTH && !seen.has(text)) {
        seen.add(text);
        candidates.push(text);
      }
      if (candidates.length >= this.TEXT_EXTRACTION_MAX_CANDIDATES) {
        break;
      }

      textNode = walker.nextNode();
    }
    return candidates;
  }

  /**
   * Removes CSS styling, HTML artifacts, and other noise from extracted text.
   * Strips CSS blocks, @-rules, style declarations, and normalizes whitespace.
   * @param input - The raw extracted text
   * @returns Sanitized text suitable for display
   */
  private sanitizeExtractedText(input: string): string {
    const withoutCssBlocks = this.stripCssBlocks(input);
    const withoutAtRules = this.stripCssAtRules(withoutCssBlocks);
    let sanitized = withoutAtRules.replace(this.CSS_ROOT_SELECTOR_PATTERN, ' ');
    sanitized = this.replaceRepeatedRegex(
      sanitized,
      this.CSS_PROPERTY_PATTERN,
      ' ',
    );
    sanitized = this.replaceRepeatedRegex(sanitized, this.CSS_BRACES_PATTERN, ' ');
    sanitized = sanitized.split(/\s+/).join(' ');
    return sanitized.trim();
  }

  /**
   * Repeatedly applies a regex replacement until no more matches are found.
   * Useful for removing nested CSS patterns that require multiple passes.
   * @param input - The input string to process
   * @param pattern - The regex pattern to match and replace
   * @param replacement - The replacement string
   * @returns The fully processed string
   */
  private replaceRepeatedRegex(input: string, pattern: RegExp, replacement: string): string {
    let result = input;
    while (pattern.test(result)) {
      const next = result.replace(pattern, replacement);
      if (next === result) {
        break;
      }
      result = next;
    }
    return result;
  }

  /**
   * Removes CSS block content (anything between curly braces) from text.
   * Tracks brace nesting depth to handle nested blocks correctly.
   * @param input - The input string
   * @returns String with CSS blocks replaced by spaces
   */
  private stripCssBlocks(input: string): string {
    let depth = 0;
    let output = '';

    for (const char of input) {
      if (char === '{') {
        depth += 1;
        output += ' ';
        continue;
      }

      if (char === '}') {
        if (depth > 0) {
          depth -= 1;
        }
        output += ' ';
        continue;
      }

      if (depth === 0) {
        output += char;
      }
    }

    return output;
  }

  /**
   * Removes CSS @-rules (e.g., @media, @font-face, @keyframes) from text.
   * Handles both semicolon-terminated rules and brace-delimited rules.
   * @param input - The input string
   * @returns String with CSS @-rules removed
   */
  private stripCssAtRules(input: string): string {
    let output = '';
    let i = 0;

    while (i < input.length) {
      const atIndex = input.indexOf('@', i);
      if (atIndex < 0) {
        output += input.slice(i);
        break;
      }

      output += input.slice(i, atIndex);

      const terminatorIndex = this.findCssAtRuleTerminator(input, atIndex + 1);
      if (terminatorIndex < 0) {
        output += ' ';
        break;
      }

      output += ' ';
      i = input[terminatorIndex] === ';' ? terminatorIndex + 1 : this.skipCssBracedBlock(input, terminatorIndex + 1);
    }

    return output;
  }

  /**
   * Finds the end of a CSS @-rule starting at the given position.
   * Returns the index of the terminating semicolon or opening brace.
   * Used to locate where a CSS @-rule ends before skipping its content.
   * @param input - The input string
   * @param startIndex - The position to start searching from
   * @returns Index of the terminator, or -1 if not found
   */
  private findCssAtRuleTerminator(input: string, startIndex: number): number {
    let index = startIndex;
    while (index < input.length && input[index] !== ';' && input[index] !== '{') {
      index += 1;
    }
    return index < input.length ? index : -1;
  }

  /**
   * Skips over a complete CSS brace-delimited block from the starting position.
   * Correctly handles nested braces by tracking depth.
   * Used to skip CSS rule bodies and nested blocks when stripping @-rules.
   * @param input - The input string
   * @param startIndex - The position to start skipping from (inside or before the brace)
   * @returns The index after the closing brace, or end of string if unclosed
   */
  private skipCssBracedBlock(input: string, startIndex: number): number {
    let index = startIndex;
    let depth = 1;

    while (index < input.length && depth > 0) {
      if (input[index] === '{') {
        depth += 1;
      } else if (input[index] === '}') {
        depth -= 1;
      }
      index += 1;
    }

    return index;
  }

  /**
   * Splits a string into multiple lines with a maximum character limit per line.
   * Used to format extracted text for display in the thumbnail.
   * @param text - The text to split
   * @param maxCharsPerLine - Maximum characters per line
   * @param maxLines - Maximum number of lines to return
   * @returns An array of text lines
   */
  private splitIntoLines(text: string, maxCharsPerLine: number, maxLines: number): string[] {
    const lines: string[] = [];
    for (let i = 0; i < text.length && lines.length < maxLines; i += maxCharsPerLine) {
      lines.push(text.slice(i, i + maxCharsPerLine));
    }
    return lines;
  }

  /**
   * Draws a text-based thumbnail on a canvas (240x320px).
   * Creates a DOCX-themed thumbnail with blue header and white content area.
   *
   * Canvas Exception:
   * This method uses direct document.createElement('canvas') instead of Renderer2
   * because Renderer2 does not provide a way to get the 2D canvas context needed
   * for graphics rendering. Canvas API is purely graphics-focused and requires
   * direct context access which is not available through Renderer2.
   *
   * Resource Management:
   * - Canvas is created only after document check
   * - Canvas is cleaned up immediately after blob extraction (toBlob callback)
   * - This prevents memory leaks from accumulated canvas objects
   * - Cleanup also happens in finally block if rendering fails
   *
   * @param lines - Array of text lines to display in the thumbnail
   * @returns A JPEG Blob of the thumbnail, or undefined if canvas rendering fails
   */
  private async drawTextThumbnail(lines: string[]): Promise<Blob | undefined> {
    if (!this.document) {
      return undefined;
    }

    let canvas: HTMLCanvasElement | undefined;
    try {
      // Canvas creation uses direct document API (exception to Renderer2 abstraction)
      // This is necessary because Renderer2 does not support getting canvas 2D context
      canvas = this.document.createElement('canvas');
      canvas.width = this.THUMBNAIL_WIDTH_PX;
      canvas.height = this.THUMBNAIL_HEIGHT_PX;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return undefined;
      }

      ctx.fillStyle = this.THUMBNAIL_BACKGROUND_COLOR;
      ctx.fillRect(0, 0, this.THUMBNAIL_WIDTH_PX, this.THUMBNAIL_HEIGHT_PX);

      ctx.fillStyle = this.THUMBNAIL_INNER_BG_COLOR;
      ctx.fillRect(
        this.THUMBNAIL_PADDING_PX,
        this.THUMBNAIL_PADDING_PX,
        this.THUMBNAIL_WIDTH_PX - this.THUMBNAIL_PADDING_PX * 2,
        this.THUMBNAIL_HEIGHT_PX - this.THUMBNAIL_PADDING_PX * 2
      );

      ctx.fillStyle = this.THUMBNAIL_HEADER_COLOR;
      ctx.fillRect(
        this.THUMBNAIL_PADDING_PX,
        this.THUMBNAIL_PADDING_PX,
        this.THUMBNAIL_WIDTH_PX - this.THUMBNAIL_PADDING_PX * 2,
        this.THUMBNAIL_HEADER_HEIGHT_PX
      );
      ctx.fillStyle = this.THUMBNAIL_INNER_BG_COLOR;
      ctx.font = this.THUMBNAIL_HEADER_FONT;
      ctx.fillText('DOCX', this.THUMBNAIL_HEADER_X_OFFSET_PX, this.THUMBNAIL_HEADER_Y_OFFSET_PX);

      ctx.fillStyle = this.THUMBNAIL_TEXT_COLOR;
      ctx.font = this.THUMBNAIL_TEXT_FONT;

      let y = this.THUMBNAIL_TEXT_START_Y_PX;
      for (const line of lines) {
        if (y > this.THUMBNAIL_HEIGHT_PX - this.THUMBNAIL_BOTTOM_MARGIN_PX) {
          break;
        }
        ctx.fillText(line, this.THUMBNAIL_TEXT_LEFT_PADDING_PX, y);
        y += this.THUMBNAIL_TEXT_LINE_HEIGHT_PX;
      }

      // Return blob with proper cleanup after extraction
      return await new Promise<Blob | undefined>((resolve) => {
        canvas!.toBlob((blob) => {
          // Clean up canvas resources immediately after blob is extracted
          // This prevents accumulated canvas objects from staying in memory
          if (canvas) {
            canvas.width = 0;
            canvas.height = 0;
            canvas = undefined;
          }
          resolve(blob ?? undefined);
        }, 'image/jpeg', this.THUMBNAIL_JPEG_QUALITY);
      });
    } catch {
      return undefined;
    } finally {
      // Best-effort cleanup of canvas if rendering failed
      if (canvas) {
        try {
          canvas.width = 0;
          canvas.height = 0;
        } catch {
          // Best-effort cleanup.
        }
      }
    }
  }
}
