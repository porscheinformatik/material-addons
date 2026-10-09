import { FilePreviewKind } from '../models/file-preview.models';

/**
 * Detects the file preview kind from MIME type and file extension.
 *
 * Detection prioritizes MIME type matching over extension matching,
 * with extension as a reliable fallback for generic or missing MIME types.
 *
 * @param mimeType - The MIME type (case-insensitive)
 * @param extension - The file extension without dot (case-insensitive)
 * @returns The detected FilePreviewKind: 'image' | 'pdf' | 'docx' | 'xlsx' | 'unknown'
 */
export function detectFileKind(mimeType: string, extension: string): FilePreviewKind {
  const normalizedMimeType = mimeType.toLowerCase();
  const normalizedExtension = extension.toLowerCase();

  // PDF detection
  if (normalizedMimeType === 'application/pdf' || normalizedExtension === 'pdf') {
    return 'pdf';
  }

  // DOCX detection — docx-preview only parses OOXML (zip/XML) Word documents.
  // Legacy binary .doc, RTF and ODT are intentionally excluded so they fall through
  // to the 'unknown' branch and get a working "no preview available" + download UI
  // instead of being misdetected as 'docx' and failing to render.
  const docxMimePatterns = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-word.document.macroenabled.12',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
    'application/vnd.ms-word.template.macroenabled.12',
  ];
  const docxExtensions = ['docx', 'docm', 'dotx', 'dotm'];

  if (docxMimePatterns.includes(normalizedMimeType) || docxExtensions.includes(normalizedExtension)) {
    return 'docx';
  }

  // Excel detection (spreadsheets)
  const excelMimePatterns = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
    'application/vnd.ms-excel.sheet.macroenabled.12', // .xlsm
    'application/vnd.ms-excel.sheet.binary.macroenabled.12', // .xlsb
    'text/csv',
    'application/vnd.oasis.opendocument.spreadsheet', // .ods
  ];
  const excelExtensions = ['xlsx', 'xls', 'xlsm', 'xlsb', 'csv', 'ods'];

  if (excelMimePatterns.some((pattern) => normalizedMimeType.includes(pattern)) || excelExtensions.includes(normalizedExtension)) {
    return 'xlsx';
  }

  // Image detection (JPEG, PNG, GIF, WebP, BMP, SVG, ICO)
  const imageMimePatterns = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/bmp',
    'image/svg+xml',
    'image/x-icon',
    'image/ico',
  ];
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'ico'];

  if (
    imageMimePatterns.includes(normalizedMimeType) ||
    normalizedMimeType.startsWith('image/') ||
    imageExtensions.includes(normalizedExtension)
  ) {
    return 'image';
  }

  // No match found
  return 'unknown';
}
