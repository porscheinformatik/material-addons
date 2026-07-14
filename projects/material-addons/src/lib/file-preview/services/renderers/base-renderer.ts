import { FilePreviewItem, FilePreviewKind } from '../../models/file-preview.models';

/**
 * Base contract for preview renderers.
 *
 * Renderer strategy allows adding specialized implementations per file kind
 * (PDF, DOCX, image etc.) without growing FilePreviewService further.
 *
 * Each renderer is responsible for:
 * 1. Determining support for specific MIME types/extensions (supports method)
 * 2. Generating a thumbnail image for preview galleries (generateThumbnail method)
 * 3. Rendering a full preview into a host element (renderPreview method - optional)
 *
 * Implementation Notes:
 * - Modern renderers (DOCX) use Angular's createComponent() to inject standalone components
 * - Avoid direct DOM manipulation; delegate to Angular components instead
 * - Thumbnails are JPEG images (240x320px recommended)
 * - Priority determines renderer selection order when multiple renderers support a type
 */
export abstract class BaseRenderer {
  /** File kind identifier ('image', 'pdf', 'docx', 'xlsx', 'unknown') */
  abstract readonly kind: FilePreviewKind;

  /** Priority for renderer selection. Higher values are tried first. */
  abstract readonly priority: number;

  /**
   * Renders a full preview of the file into the provided host element.
   * This is an optional operation; only implemented for renderers that support full previews.
   * @param _host - The DOM element to render the preview into
   * @param _source - The file source (URL, Blob, ArrayBuffer, etc.)
   * @param _rowLimit - Optional row limit for spreadsheet previews
   */
  async renderPreview(_host: HTMLElement, _source: FilePreviewItem['source'], _rowLimit?: number): Promise<void> {
    // Optional operation for renderers that can render full preview content
    // directly into an element (e.g. DOCX).
  }

  /**
   * Determines if this renderer can handle the given file.
   * @param mimeType - The MIME type of the file
   * @param extension - The file extension (without dot)
   * @returns True if this renderer supports the file type
   */
  abstract supports(mimeType: string, extension: string): boolean;

  /**
   * Generates a thumbnail image for the file.
   * Used in preview galleries and overlay headers.
   * @param source - The file source (URL, Blob, ArrayBuffer, etc.)
   * @param resolvedUrl - Optional pre-resolved URL for the file
   * @returns A JPEG Blob thumbnail (recommended 240x320px), or undefined if generation fails
   */
  abstract generateThumbnail(source: FilePreviewItem['source'], resolvedUrl: string): Promise<Blob | undefined>;
}
