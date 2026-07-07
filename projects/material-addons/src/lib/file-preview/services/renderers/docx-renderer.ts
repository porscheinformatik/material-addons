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
  private readonly supportedTypes = new Set([
    'application/msword',
    'text/plain',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-word.document.macroenabled.12',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
    'application/vnd.ms-word.template.macroenabled.12',
    'application/vnd.oasis.opendocument.text',
    'application/rtf',
    'text/rtf',
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
   * 1. Rendering the document to a hidden container using docx-preview library
   * 2. Extracting and sanitizing text content from the rendered HTML
   * 3. Drawing the text onto a canvas thumbnail (240x320px)
   * @param source - The DOCX file source (URL, Blob, ArrayBuffer, etc.)
   * @returns A JPEG Blob representing the thumbnail, or undefined if generation fails
   */
  async generateThumbnail(source: FilePreviewItem['source']): Promise<Blob | undefined> {
    if (!this.isBrowser || !this.document || !source) {
      return undefined;
    }

    // Create an off-screen container element for rendering the DOCX document.
    // This is necessary because the docx-preview library is a third-party rendering tool that requires
    // a real, live DOM element to render documents into. The library cannot work with virtual/shadow DOM
    // or produce HTML without a DOM context.
    const host = this.createElement('div');
    this.setStyle(host, 'position', 'fixed');
    this.setStyle(host, 'left', '-10000px');
    this.setStyle(host, 'top', '0');
    this.setStyle(host, 'width', '820px');
    this.setStyle(host, 'height', '1050px');
    this.setStyle(host, 'overflow', 'hidden');
    this.setStyle(host, 'opacity', '0');
    this.setStyle(host, 'pointerEvents', 'none');

    // Append the container to the DOM so docx-preview can render into it.
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
      this.removeElement(this.document!.body, host);
    }
  }

  /**
   * Renders a full DOCX preview by:
   * 1. Loading the docx-preview library dynamically
   * 2. Rendering DOCX to a temporary off-screen container
   * 3. Extracting the rendered HTML content
   * 4. Creating and injecting the DocxPreviewComponent with the HTML
   * Uses Angular's createComponent() instead of direct DOM manipulation.
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

      // Create a temporary off-screen container to render the DOCX document.
      // This is required because the docx-preview library needs a real, live DOM element to render documents.
      // We cannot obtain rendered HTML without providing the library a DOM context.
      // The temporary container is positioned off-screen and hidden to avoid affecting the page layout.
      const tempContainer = this.createElement('div');
      this.setStyle(tempContainer, 'position', 'fixed');
      this.setStyle(tempContainer, 'left', '-10000px');
      this.setStyle(tempContainer, 'visibility', 'hidden');
      
      // Append the temporary container to the DOM so docx-preview can render into it.
      // After rendering completes, we extract the HTML content and clean up by removing this container.
      this.appendElement(this.document!.body, tempContainer);

      try {
        // Render DOCX to temporary container
        await renderAsync(arrayBuffer, tempContainer, undefined, {
          className: 'docx-preview-document',
          inWrapper: true,
          ignoreWidth: false,
          ignoreHeight: true,
          breakPages: true,
        });

        // Extract the rendered HTML
        const htmlContent = tempContainer.innerHTML;

        // Create and inject the standalone component
        this.setProperty(host, 'innerHTML', '');
        const componentRef = createComponent(DocxPreviewComponent, {
          environmentInjector: this.environmentInjector,
        });

        componentRef.setInput('docxHtmlContent', htmlContent);
        componentRef.setInput('isError', false);

        this.appendElement(host, componentRef.location.nativeElement);
        componentRef.changeDetectorRef.detectChanges();
      } finally {
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
   * Falls back to direct DOM manipulation if Renderer2 is not available.
   * @param host - The container element where the placeholder will be rendered
   * @param message - The message text to display
   */
  private renderPlaceholder(host: HTMLElement, message: string): void {
    if (this.renderer) {
      const placeholderDiv = this.renderer.createElement('div');
      this.renderer.addClass(placeholderDiv, 'docx-placeholder');
      this.renderer.setProperty(placeholderDiv, 'textContent', message);
      this.renderer.setProperty(host, 'innerHTML', '');
      this.renderer.appendChild(host, placeholderDiv);
    } else {
      const placeholderDiv = this.document!.createElement('div');
      placeholderDiv.className = 'docx-placeholder';
      placeholderDiv.textContent = message;
      host.innerHTML = '';
      host.appendChild(placeholderDiv);
    }
  }

  /**
   * Appends a child element to a parent using Renderer2 if available, or direct DOM if not.
   * Provides a safe abstraction over DOM manipulation that works in all contexts.
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
   * Removes a child element from a parent using Renderer2 if available, or direct DOM if not.
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
   * Creates an element using Renderer2 if available, or direct DOM if not.
   * @param tagName - The tag name of the element to create
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
   * Sets inline styles on an element using Renderer2 if available, or direct DOM if not.
   * @param element - The element to style
   * @param styleName - The style property name
   * @param styleValue - The style value
   */
  private setStyle(element: HTMLElement, styleName: string, styleValue: string): void {
    if (this.renderer) {
      this.renderer.setStyle(element, styleName, styleValue);
    } else {
      (element.style as any)[this.toCamelCase(styleName)] = styleValue;
    }
  }

  /**
   * Sets a property on an element using Renderer2 if available, or direct DOM if not.
   * @param element - The element to set the property on
   * @param propertyName - The property name
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
    const selectors = ['.docx-page', '.docx-wrapper section.docx', '.docx-wrapper > section', 'section.docx', '.docx-wrapper'];

    for (const selector of selectors) {
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
    clone.querySelectorAll('style, script, noscript, svg, defs').forEach((node) => node.remove());

    // Only select leaf-level block elements that directly contain text — avoids
    // collecting parent text that already includes all child text (duplicate issue).
    const blockSelectors = 'h1, h2, h3, h4, h5, h6, p, li, td, th';
    const seen = new Set<string>();
    const candidates: string[] = [];

    this.collectFromBlockElements(clone, blockSelectors, seen, candidates);
    this.collectFromTextNodes(clone, seen, candidates);

    if (candidates.length === 0) {
      const fallback = this.sanitizeExtractedText(clone.textContent ?? '');
      if (!fallback) {
        return ['DOCX Document'];
      }
      return this.splitIntoLines(fallback, 44, 14);
    }

    const joined = candidates.join(' • ');
    return this.splitIntoLines(joined, 44, 14);
  }

  /**
   * Collects text from block-level HTML elements (h1-h6, p, li, td, th).
   * Avoids collecting duplicate text from nested elements by skipping descendants.
   * @param root - The root element to search
   * @param blockSelectors - CSS selectors for block elements to collect from
   * @param seen - Set of already-collected text strings to avoid duplicates
   * @param candidates - Output array to append collected text strings
   */
  private collectFromBlockElements(root: HTMLElement, blockSelectors: string, seen: Set<string>, candidates: string[]): void {
    for (const el of Array.from(root.querySelectorAll<HTMLElement>(blockSelectors))) {
      // Skip if this element is a descendant of another matched block to avoid nesting duplicates.
      if (el.parentElement?.closest(blockSelectors)) {
        continue;
      }

      this.addCandidateText(el.textContent ?? '', seen, candidates);
      if (candidates.length >= 18) {
        return;
      }
    }
  }

  /**
   * Collects text from text nodes throughout the entire document.
   * Uses TreeWalker to iterate all text nodes, capturing content that isn't in block elements.
   * @param root - The root element to walk
   * @param seen - Set of already-collected text strings to avoid duplicates
   * @param candidates - Output array to append collected text strings
   */
  private collectFromTextNodes(root: HTMLElement, seen: Set<string>, candidates: string[]): void {
    // Include meaningful text nodes from the whole subtree. This covers content
    // that is normalized out of invalid block markup but still present as text.
    const walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let textNode = walker.nextNode();

    while (textNode) {
      this.addCandidateText(textNode.textContent ?? '', seen, candidates);
      if (candidates.length >= 18) {
        return;
      }

      textNode = walker.nextNode();
    }
  }

  /**
   * Sanitizes and adds a candidate text string if it's meaningful and not a duplicate.
   * Only adds strings of 3+ characters that haven't been seen before.
   * @param rawText - The raw text to sanitize and add
   * @param seen - Set tracking already-added strings
   * @param candidates - Output array to append the text if valid
   */
  private addCandidateText(rawText: string, seen: Set<string>, candidates: string[]): void {
    const text = this.sanitizeExtractedText(rawText);
    if (text.length >= 3 && !seen.has(text)) {
      seen.add(text);
      candidates.push(text);
    }
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
    let sanitized = withoutAtRules.replace(/^\s*(body|html|:root)\b\s*/i, ' ');
    sanitized = this.replaceRepeatedRegex(
      sanitized,
      /\b(class|style|font-family|line-height|margin|padding|color|background|display)\b\s*[:=]\s*[^;]+;?/gi,
      ' ',
    );
    sanitized = this.replaceRepeatedRegex(sanitized, /[{}]/g, ' ');
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

      const terminatorIndex = this.findAtRuleTerminator(input, atIndex + 1);
      if (terminatorIndex < 0) {
        output += ' ';
        break;
      }

      output += ' ';
      i = input[terminatorIndex] === ';' ? terminatorIndex + 1 : this.skipBracedBlock(input, terminatorIndex + 1);
    }

    return output;
  }

  /**
   * Finds the end of a CSS @-rule starting at the given position.
   * Returns the index of the terminating semicolon or opening brace.
   * @param input - The input string
   * @param startIndex - The position to start searching from
   * @returns Index of the terminator, or -1 if not found
   */
  private findAtRuleTerminator(input: string, startIndex: number): number {
    let index = startIndex;
    while (index < input.length && input[index] !== ';' && input[index] !== '{') {
      index += 1;
    }
    return index < input.length ? index : -1;
  }

  /**
   * Skips over a complete CSS brace-delimited block from the starting position.
   * Correctly handles nested braces by tracking depth.
   * @param input - The input string
   * @param startIndex - The position to start skipping from (inside or before the brace)
   * @returns The index after the closing brace, or end of string if unclosed
   */
  private skipBracedBlock(input: string, startIndex: number): number {
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
   * @param lines - Array of text lines to display in the thumbnail
   * @returns A JPEG Blob of the thumbnail, or undefined if canvas rendering fails
   */
  private async drawTextThumbnail(lines: string[]): Promise<Blob | undefined> {
    if (!this.document) {
      return undefined;
    }

    const width = 240;
    const height = 320;
    const canvas = this.document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return undefined;
    }

    ctx.fillStyle = '#eef2ff';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(12, 12, width - 24, height - 24);

    ctx.fillStyle = '#2563eb';
    ctx.fillRect(12, 12, width - 24, 28);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Arial, sans-serif';
    ctx.fillText('DOCX', 22, 30);

    ctx.fillStyle = '#374151';
    ctx.font = '11px Arial, sans-serif';

    let y = 58;
    for (const line of lines) {
      if (y > height - 20) {
        break;
      }
      ctx.fillText(line, 20, y);
      y += 16;
    }

    return await new Promise<Blob | undefined>((resolve) => {
      canvas.toBlob((blob) => resolve(blob ?? undefined), 'image/jpeg', 0.86);
    });
  }
}
