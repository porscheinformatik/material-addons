import { FilePreviewItem, FilePreviewKind } from '../../models/file-preview.models';

/**
 * Base contract for preview renderers.
 *
 * Renderer strategy allows adding specialized implementations per file kind
 * (PDF, DOCX, image, etc.) without growing FilePreviewService further.
 */
export abstract class BaseRenderer {
  abstract readonly kind: FilePreviewKind;
  abstract readonly priority: number;

  async renderPreview(_host: HTMLElement, _source: FilePreviewItem['source'], _rowLimit?: number): Promise<void> {
    // Optional operation for renderers that can render full preview content
    // directly into an element (e.g. DOCX).
  }

  abstract supports(mimeType: string, extension: string): boolean;

  abstract generateThumbnail(source: FilePreviewItem['source'], resolvedUrl: string): Promise<Blob | undefined>;
}
