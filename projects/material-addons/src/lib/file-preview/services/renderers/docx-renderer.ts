import { Injectable } from '@angular/core';

import { FilePreviewItem } from '../../models/file-preview.models';
import { BaseRenderer } from './base-renderer';

/**
 * DocxRenderer handles detection of DOCX file types.
 *
 * NOTE: DOCX thumbnail generation has been refactored to use a real scaled render
 * via DocxPreviewComponent instead of generating a fake canvas-based thumbnail.
 * The thumbnails are now component-driven with lazy-loading via IntersectionObserver.
 *
 * This renderer now only handles type detection for routing files to the appropriate
 * component. The actual rendering and thumbnail generation is handled by
 * DocxPreviewComponent with support for scaling via CSS transform.
 */
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
  ]);

  private readonly supportedExtensions = new Set(['doc', 'docx', 'docm', 'dot', 'dotx', 'dotm', 'odt', 'rtf']);

  /**
   * Determines if this renderer can handle the given MIME type or file extension.
   *
   * @param mimeType - The MIME type (e.g., 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
   * @param extension - The file extension (e.g., 'docx')
   * @returns True if either the MIME type or extension is supported by this renderer
   */
  supports(mimeType: string, extension: string): boolean {
    const normalizedMimeType = mimeType.toLowerCase();
    return this.supportedTypes.has(normalizedMimeType) || this.supportedExtensions.has(extension);
  }

  /**
   * Generates a thumbnail for a DOCX file.
   *
   * NOTE: DOCX thumbnails are now component-driven via DocxPreviewComponent.
   * The component renders the actual document at scaled-down size with CSS transform,
   * eliminating the need for canvas-based fake thumbnails.
   * This method returns undefined to indicate the service should not generate thumbnails.
   * The gallery will show the DOCX icon, and when the tile scrolls into view,
   * IntersectionObserver triggers the DocxPreviewComponent to render the real thumbnail.
   *
   * @returns Always undefined - thumbnails are component-driven
   */
  async generateThumbnail(_source: FilePreviewItem['source'], _resolvedUrl: string): Promise<Blob | undefined> {
    return undefined;
  }
}
