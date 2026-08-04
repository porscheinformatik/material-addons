import { Injectable } from '@angular/core';

import { FilePreviewItem } from '../../models/file-preview.models';
import { BaseRenderer } from './base-renderer';

/**
 * Excel/XLSX file renderer.
 *
 * Detects and classifies Excel files (XLSX, XLS, CSV, ODS, etc.).
 * Currently, Excel files do not have an inline preview implemented,
 * so they display with an Excel icon instead of a preview.
 */
@Injectable({ providedIn: 'root' })
export class ExcelRenderer extends BaseRenderer {
  readonly kind = 'xlsx' as const;
  readonly priority = 15;

  /**
   * Detects Excel/spreadsheet files by MIME type and extension.
   * @returns True if the file is an Excel or spreadsheet file
   */
  supports(mimeType: string, extension: string): boolean {
    const normalizedMime = mimeType.toLowerCase();
    const normalizedExt = extension.toLowerCase();

    // Excel MIME types
    const excelMimes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel.sheet.macroenabled.12',
      'application/vnd.ms-excel.template.macroenabled.12',
      'application/vnd.oasis.opendocument.spreadsheet',
      'application/csv'
    ];

    // Excel extensions
    const excelExtensions = ['xls', 'xlsx', 'xlsm', 'xlsb', 'xlt', 'xltm', 'csv', 'ods'];

    return excelMimes.some((m) => normalizedMime.includes(m)) || excelExtensions.includes(normalizedExt);
  }

  /**
   * Thumbnail generation is not supported for Excel files.
   * @returns Always returns undefined
   */
  async generateThumbnail(_source: FilePreviewItem['source']): Promise<Blob | undefined> {
    return Promise.resolve(undefined);
  }
}
