import { ThemePalette } from '@angular/material/core';

export type FilePreviewKind = 'image' | 'pdf' | 'docx' | 'xlsx' | 'unknown';
export type ThumbnailSize = 'sm' | 'md' | 'lg' | { width: number; height: number };

/**
 * Structured Base64 input accepted by the component as an alternative to raw strings.
 * Use this when you receive binary data from a backend API in Base64 format along
 * with the file's MIME type (e.g. carCAT document service responses).
 *
 * @example
 * // Backend returns { content: "<base64>", contentType: "application/pdf" }
 * const source: FilePreviewBase64Input = {
 *   data: apiResponse.content,   // raw base64 or full data: URL
 *   mimeType: apiResponse.contentType
 * };
 */
export interface FilePreviewBase64Input {
  /** Raw Base64 string or fully qualified data URI (data:<mime>;base64,<data>). */
  data: string;
  /** MIME type of the file, e.g. 'image/png' or 'application/pdf'. */
  mimeType: string;
}

/**
 * Represents a single file item to be previewed. The `source` field is intentionally
 * flexible to accommodate all common integration patterns (URL, Blob, File, ArrayBuffer,
 * raw Base64, or structured Base64 input).
 */
export interface FilePreviewItem {
  /** Unique stable identifier for this item. Used for trackBy and delete events. */
  id: string;
  /** Display name including extension, e.g. 'service-order.pdf'. */
  name: string;
  /**
   * MIME type string, e.g. 'application/pdf'. Recommended for accurate kind detection,
   * but optional when the file extension in `name` is sufficient for renderer fallback.
   */
  mimeType?: string;
  /**
   * File content in any supported form.
   * - `string`               — URL or data URI (data:<mime>;base64,<data>)
   * - `FilePreviewBase64Input` — structured Base64 input from backend APIs
   * - `Blob | File`          — browser file objects
   * - `ArrayBuffer`          — raw binary buffer
   */
  source?: string | FilePreviewBase64Input | Blob | File | ArrayBuffer;
  /** Pre-resolved URL for the full-size preview. Skips internal URL resolution when set. */
  previewUrl?: string;
  /** Pre-resolved URL for the thumbnail image. Skips thumbnail generation when set. */
  thumbnailUrl?: string;
  /** Optional file size in bytes. Displayed in the overlay header. */
  size?: number;
  /** Additional metadata fields passed through to action/delete events unchanged. */
  meta?: Record<string, unknown>;
}

/**
 * Resolved version of `FilePreviewItem` produced by the service after URL resolution
 * and thumbnail generation. Emitted through all output events.
 */
export interface ResolvedFilePreviewItem extends FilePreviewItem {
  /** Detected rendering kind after MIME + extension analysis. */
  kind: FilePreviewKind;
  /** Resolved URL suitable for preview (object URL, data URI, or original URL). */
  resolvedPreviewUrl?: string;
  /** Resolved thumbnail URL. Undefined if no thumbnail could be generated (shows icon). */
  resolvedThumbnailUrl?: string;
  /** Lower-cased file extension extracted from name, e.g. 'pdf'. */
  extension: string;
}

/** A custom action button rendered in the thumbnail action bar and overlay header. */
export interface FilePreviewAction {
  /** Unique identifier returned with the `actionClicked` event. */
  id: string;
  /** Material icon ligature, e.g. 'info', 'share', 'edit'. */
  icon: string;
  /** Tooltip and aria-label. */
  label: string;
  /** Angular Material theme colour applied to the icon button. */
  color?: ThemePalette;
}

/** Labels used by the main file preview component. */
export interface FilePreviewLabels {
  /** Aria label for the outer gallery section. */
  galleryAriaLabel?: string;
  /** Prefix used for thumbnail button aria label. */
  thumbnailPreviewAriaPrefix?: string;
  /** Empty-state message when no items are present. */
  emptyStateMessage?: string;
  /** Tooltip and aria label for preview action button. */
  previewActionLabel?: string;
  /** Tooltip and aria label for download action button. */
  downloadActionLabel?: string;
  /** Tooltip and aria label for delete action button. */
  deleteActionLabel?: string;
  /** Tooltip and aria label for close overlay action. */
  closeActionLabel?: string;
  /** Unsupported PDF inline-viewer message. */
  unsupportedPdfMessage?: string;
  /** Message shown for unknown/unsupported file kinds. */
  noPreviewMessage?: string;
  /** Link/button text for download actions in fallback sections. */
  downloadLabel?: string;
}

/** Configuration object for `<mad-file-preview>`. All fields are optional. */
export interface FilePreviewConfig {
  /**
   * Preset keyword or explicit pixel dimensions.
   * - 'sm'  →  96 × 96 px
   * - 'md'  → 132 × 132 px  (default)
   * - 'lg'  → 180 × 180 px
   * - { width, height } → custom size in px
   */
  thumbnailSize?: ThumbnailSize;
  /** When false the thumbnail click and action bar preview button do nothing. Default: true. */
  showOverlayPreview?: boolean;
  /** Shows the action bar below each thumbnail. Default: true. */
  showActionIcons?: boolean;
  /** Adds a Delete button to the action bar and overlay header. Default: true. */
  showDeleteAction?: boolean;
  /** Adds a Preview icon button to action bars when overlay preview is enabled. Default: true. */
  showPreviewAction?: boolean;
  /** Adds a Download icon button to action bars and overlay header. Default: true. */
  showDownloadAction?: boolean;
  /** Additional custom action buttons appended to every action bar. */
  actions?: FilePreviewAction[];
}

export type ResolvedFilePreviewConfig = Required<Omit<FilePreviewConfig, 'actions'>> & Pick<FilePreviewConfig, 'actions'>;

export const DEFAULT_FILE_PREVIEW_CONFIG: ResolvedFilePreviewConfig = {
  thumbnailSize: 'md',
  showOverlayPreview: true,
  showActionIcons: true,
  showDeleteAction: true,
  showPreviewAction: true,
  showDownloadAction: true,
  actions: [],
};

export const DEFAULT_FILE_PREVIEW_LABELS: Required<FilePreviewLabels> = {
  galleryAriaLabel: 'File preview gallery',
  thumbnailPreviewAriaPrefix: 'Preview',
  emptyStateMessage: 'No files to preview',
  previewActionLabel: 'Preview',
  downloadActionLabel: 'Download',
  deleteActionLabel: 'Delete',
  closeActionLabel: 'Close preview',
  unsupportedPdfMessage: 'Your browser does not support inline PDF viewing.',
  noPreviewMessage: 'No preview available for this file type.',
  downloadLabel: 'Download',
};

/** Thumbnail dimension presets in pixels. */
export const THUMBNAIL_SIZE_MAP: Record<Exclude<ThumbnailSize, object>, { width: number; height: number }> = {
  sm: { width: 96, height: 96 },
  md: { width: 132, height: 132 },
  lg: { width: 180, height: 180 },
};
