import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

import { FilePreviewItem } from '../../models/file-preview.models';
import { BaseRenderer } from './base-renderer';
import { toArrayBuffer } from './source-utils';

@Injectable({ providedIn: 'root' })
export class DocxRenderer extends BaseRenderer {
  readonly kind = 'docx' as const;
  readonly priority = 10;
  private readonly supportedTypes = new Set([
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-word.document.macroenabled.12',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
    'application/vnd.ms-word.template.macroenabled.12',
    'application/vnd.oasis.opendocument.text',
    'application/rtf',
    'text/rtf',
    'text/plain',
  ]);
  private readonly supportedExtensions = new Set(['doc', 'docx', 'docm', 'dot', 'dotx', 'dotm', 'odt', 'rtf', 'txt']);

  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT, { optional: true });
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  supports(mimeType: string, extension: string): boolean {
    const normalizedMimeType = mimeType.toLowerCase();
    return this.supportedTypes.has(normalizedMimeType) || this.supportedExtensions.has(extension);
  }

  async generateThumbnail(source: FilePreviewItem['source']): Promise<Blob | undefined> {
    if (!this.isBrowser || !this.document || !source) {
      return undefined;
    }

    const host = this.document.createElement('div');
    host.style.position = 'fixed';
    host.style.left = '-10000px';
    host.style.top = '0';
    host.style.width = '820px';
    host.style.height = '1050px';
    host.style.overflow = 'hidden';
    host.style.opacity = '0';
    host.style.pointerEvents = 'none';

    this.document.body?.appendChild(host);

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
      host.remove();
    }
  }

  override async renderPreview(host: HTMLElement, source: FilePreviewItem['source']): Promise<void> {
    if (!this.isBrowser) {
      host.innerHTML = '<div class="docx-placeholder">DOCX preview is only available in the browser.</div>';
      return;
    }

    if (!source) {
      host.innerHTML = '<div class="docx-placeholder">No DOCX source provided.</div>';
      return;
    }

    const [{ renderAsync }, arrayBuffer] = await Promise.all([import('docx-preview'), toArrayBuffer(source)]);

    host.innerHTML = '';
    await renderAsync(arrayBuffer, host, undefined, {
      className: 'docx-preview-document',
      inWrapper: true,
      ignoreWidth: false,
      ignoreHeight: true,
      breakPages: true,
    });
  }

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

  private addCandidateText(rawText: string, seen: Set<string>, candidates: string[]): void {
    const text = this.sanitizeExtractedText(rawText);
    if (text.length >= 3 && !seen.has(text)) {
      seen.add(text);
      candidates.push(text);
    }
  }

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

  private findAtRuleTerminator(input: string, startIndex: number): number {
    let index = startIndex;
    while (index < input.length && input[index] !== ';' && input[index] !== '{') {
      index += 1;
    }
    return index < input.length ? index : -1;
  }

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

  private splitIntoLines(text: string, maxCharsPerLine: number, maxLines: number): string[] {
    const lines: string[] = [];
    for (let i = 0; i < text.length && lines.length < maxLines; i += maxCharsPerLine) {
      lines.push(text.slice(i, i + maxCharsPerLine));
    }
    return lines;
  }

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
