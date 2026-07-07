import { Injectable } from '@angular/core';

import { FilePreviewItem } from '../../models/file-preview.models';
import { BaseRenderer } from './base-renderer';

@Injectable({ providedIn: 'root' })
/**
 * Renderer for image files (JPEG, PNG, GIF, WebP, BMP, SVG, ICO).
 *
 * Features:
 * - Simple format detection and validation
 * - Uses resolved preview URL directly as thumbnail (no processing needed)
 * - Does not generate thumbnail blobs (images are used as-is)
 *
 * Note: Images don't require thumbnail generation because the image itself
 * is already suitable for display in preview galleries.
 */
export class ImageRenderer extends BaseRenderer {
  readonly kind = 'image' as const;
  readonly priority = 5;
  private readonly supportedTypes = new Set([
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/bmp',
    'image/svg+xml',
    'image/x-icon',
    'image/ico',
  ]);
  private readonly supportedExtensions = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'ico']);

  /**
   * Determines if this renderer can handle the given MIME type or file extension.
   * @param mimeType - The MIME type (e.g., 'image/jpeg', 'image/png')
   * @param extension - The file extension (e.g., 'jpg', 'png')
   * @returns True if this renderer supports the file type
   */
  supports(mimeType: string, extension: string): boolean {
    return this.supportedTypes.has(mimeType.toLowerCase()) || this.supportedExtensions.has(extension);
  }

  /**
   * Returns undefined because images don't need thumbnail generation.
   * The resolved preview URL for images is used directly as the thumbnail in FilePreviewService.
   * @param _source - Unused for image files
   * @param _resolvedUrl - Unused for image files (the URL itself is the thumbnail)
   * @returns Always undefined
   */
  async generateThumbnail(_source: FilePreviewItem['source'], _resolvedUrl: string): Promise<Blob | undefined> {
    // Images use resolved preview URL directly as thumbnail in FilePreviewService.
    return undefined;
  }
}
