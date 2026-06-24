import { Injectable } from '@angular/core';

import { FilePreviewItem } from '../../models/file-preview.models';
import { BaseRenderer } from './base-renderer';

@Injectable({ providedIn: 'root' })
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

  supports(mimeType: string, extension: string): boolean {
    return this.supportedTypes.has(mimeType.toLowerCase()) || this.supportedExtensions.has(extension);
  }

  async generateThumbnail(_source: FilePreviewItem['source'], _resolvedUrl: string): Promise<Blob | undefined> {
    // Images use resolved preview URL directly as thumbnail in FilePreviewService.
    return undefined;
  }
}
