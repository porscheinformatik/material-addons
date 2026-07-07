import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, EnvironmentInjector, createComponent } from '@angular/core';

import { FilePreviewItem, SheetData } from '../../models/file-preview.models';
import { ExcelPreviewComponent } from '../../components/excel-preview/excel-preview.component';
import { BaseRenderer } from './base-renderer';
import { toArrayBuffer } from './source-utils';

interface XlsxWorksheet {
  [key: string]: unknown;
}

interface XlsxWorkbook {
  SheetNames: string[];
  Sheets: Record<string, XlsxWorksheet>;
}

interface XlsxModule {
  read(data: Uint8Array, opts: { type: 'array' }): XlsxWorkbook;
  utils: {
    sheet_to_json(worksheet: XlsxWorksheet, opts?: { header?: number; defval?: unknown; raw?: boolean }): unknown[][];
  };
}

@Injectable({ providedIn: 'root' })
export class ExcelRenderer extends BaseRenderer {
  /**
   * Excel/XLSX file preview renderer.
   *
   * Architecture Overview:
   * This renderer separates concerns between file parsing and UI rendering:
   *
   * 1. @e965/xlsx Library (File Parsing)
   *    - Reads Excel files from binary format (XLS, XLSX, CSV, ODS, etc.)
   *    - Extracts worksheet objects from workbooks
   *    - Converts worksheets to 2D arrays using sheet_to_json()
   *    - Used in: generateThumbnail() and renderPreview()
   *
   * 2. ExcelPreviewComponent (Custom Display & Interactivity)
   *    - Receives parsed SheetData (name + rows) from this renderer
   *    - Handles all user interactions: sheet tabs, search, sort, filtering
   *    - Material Design table with responsive layout
   *    - Signal-based reactive state management
   *    - NO involvement in file parsing
   *
   * Data Flow:
   *   Excel File (binary)
   *        ↓
   *   @e965/xlsx.read() → XlsxWorkbook
   *        ↓
   *   xlsx.utils.sheet_to_json() → 2D arrays
   *        ↓
   *   SheetData[] { name, rows }[]
   *        ↓
   *   ExcelPreviewComponent (display + search + sort + tabs)
   *
   * Supported formats: XLS, XLSX, XLSM, XLSB, XLAM, XLT, XLTX, XLTM, ODS, CSV
   * Priority: 15 (handled after some other document formats)
   */
  readonly kind = 'xlsx' as const;
  readonly priority = 15;

  private readonly supportedTypes = new Set([
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel.sheet.macroenabled.12',
    'application/vnd.ms-excel.sheet.binary.macroenabled.12',
    'application/vnd.ms-excel.addin.macroenabled.12',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
    'application/vnd.ms-excel.template.macroenabled.12',
    'application/vnd.oasis.opendocument.spreadsheet',
    'text/csv',
  ]);
  private readonly supportedExtensions = new Set(['xls', 'xlsx', 'xlsm', 'xlsb', 'xlam', 'xlt', 'xltx', 'xltm', 'ods', 'csv']);

  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT, { optional: true });
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  /**
   * Determines if this renderer can handle the given MIME type or file extension.
   * @param mimeType - The MIME type (e.g., 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
   * @param extension - The file extension (e.g., 'xlsx')
   * @returns True if either the MIME type or extension is supported by this renderer
   */
  supports(mimeType: string, extension: string): boolean {
    return this.supportedTypes.has(mimeType.toLowerCase()) || this.supportedExtensions.has(extension);
  }

  /**
   * Generates a JPEG thumbnail for the Excel file by:
   * 1. Parsing the first sheet using shared parseSheets() logic
   * 2. Extracting the first 12 rows
   * 3. Drawing the data onto a canvas thumbnail (240x320px) with standard Excel styling
   *
   * Note: @e965/xlsx handles parsing only; drawing is custom canvas code.
   * @param source - The Excel file source (URL, Blob, ArrayBuffer, etc.)
   * @returns A JPEG Blob representing the thumbnail, or undefined if generation fails
   */
  async generateThumbnail(source: FilePreviewItem['source']): Promise<Blob | undefined> {
    if (!this.isBrowser || !this.document || !source) {
      return undefined;
    }

    try {
      const parsed = await this.parseSheets(source, 12);
      if (!parsed || parsed.sheets.length === 0) {
        return undefined;
      }

      const firstSheet = parsed.sheets[0];
      return await this.drawGridThumbnail(firstSheet.rows, firstSheet.name);
    } catch (err) {
      console.error('[ExcelRenderer.generateThumbnail] Error:', err);
      return undefined;
    }
  }

  /**
   * Renders a full Excel preview by:
   * 1. Parsing all sheets from the Excel file using shared parseSheets() logic (if browser environment and source available)
   * 2. Creating and injecting the ExcelPreviewComponent with the parsed data or error state
   * 3. Component handles ALL display logic: data tables, errors, placeholders, search, sort, filtering
   *
   * Separation of Concerns (Pure):
   * - Renderer: File validation + Excel parsing only (data extraction)
   * - ExcelPreviewComponent: ALL display logic (success states, error messages, placeholders, UX)
   *
   * Uses Angular's createComponent() for dynamic component instantiation.
   * @param host - The DOM element where the preview will be rendered
   * @param source - The Excel file source (URL, Blob, ArrayBuffer, etc.)
   * @param rowLimit - Maximum number of rows to display in the preview (default: 200)
   */
  override async renderPreview(host: HTMLElement, source: FilePreviewItem['source'], rowLimit = 200): Promise<void> {
    // Create component immediately (let component handle environment checks)
    host.innerHTML = '';
    const componentRef = createComponent(ExcelPreviewComponent, {
      environmentInjector: this.environmentInjector,
    });

    // Determine error state or parse data
    let sheetsData: SheetData[] | null = null;
    let errorMessage: string | null = null;

    if (!this.isBrowser) {
      errorMessage = 'Excel preview is only available in the browser.';
      console.warn('[ExcelRenderer.renderPreview] Not in browser environment');
    } else if (!source) {
      errorMessage = 'No Excel source provided.';
    } else {
      try {
        const parsed = await this.parseSheets(source, rowLimit);

        if (!parsed) {
          errorMessage = 'Excel renderer is not available. Please install @e965/xlsx.';
        } else if (parsed.sheets.length === 0) {
          errorMessage = 'This workbook contains no sheets.';
        } else {
          sheetsData = parsed.sheets;
        }
      } catch (err) {
        console.error('[ExcelRenderer.renderPreview] Error during rendering:', err);
        errorMessage = 'Unable to render Excel preview.';
      }
    }

    // Set component inputs (data OR error, never both)
    if (errorMessage) {
      componentRef.setInput('sheetsData', null);
      componentRef.setInput('errorMessage', errorMessage);
    } else {
      componentRef.setInput('sheetsData', sheetsData);
      componentRef.setInput('errorMessage', null);
    }
    
    componentRef.setInput('rowLimit', rowLimit);
    
    // Append component to DOM and trigger change detection
    host.appendChild(componentRef.location.nativeElement);
    componentRef.changeDetectorRef.detectChanges();
  }

  /**
   * Dynamically imports the @e965/xlsx library for parsing Excel files.
   * 
   * @e965/xlsx Responsibility:
   * - Reads binary Excel data
   * - Extracts workbooks and sheets
   * - Converts worksheets to 2D arrays
   * - Does NOT handle display or interactivity
   *
   * Logs detailed error information if the import fails.
   * @returns The loaded xlsx module, or null if the import fails
   */
  private async loadXlsx(): Promise<XlsxModule | null> {
    try {
      const result = (await import('@e965/xlsx')) as unknown as XlsxModule;
      return result;
    } catch (err) {
      console.error('[ExcelRenderer.loadXlsx] Dynamic import FAILED');
      console.error('[ExcelRenderer.loadXlsx] Error type:', err instanceof Error ? err.constructor.name : typeof err);
      console.error('[ExcelRenderer.loadXlsx] Error message:', err instanceof Error ? err.message : String(err));
      return null;
    }
  }

  /**
   * Parses all sheets from an Excel file source.
   * Centralizes shared parsing logic used by both thumbnail generation and full preview.
   * 
   * @param source - The Excel file source (URL, Blob, ArrayBuffer, etc.)
   * @param rowLimit - Optional limit on rows per sheet (applied after parsing)
   * @returns Object with parsed sheets array and first sheet name, or null if parsing fails
   */
  private async parseSheets(
    source: FilePreviewItem['source'],
    rowLimit?: number,
  ): Promise<{ sheets: SheetData[]; firstSheetName: string } | null> {
    const [xlsx, arrayBuffer] = await Promise.all([this.loadXlsx(), toArrayBuffer(source)]);

    if (!xlsx) {
      return null;
    }

    const workbook = xlsx.read(new Uint8Array(arrayBuffer), { type: 'array' });
    const sheetNames = workbook.SheetNames;

    if (sheetNames.length === 0) {
      return null;
    }

    const sheets: SheetData[] = sheetNames.map((name) => {
      const worksheet = workbook.Sheets[name];
      let rows = xlsx.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
      if (rowLimit) {
        rows = rows.slice(0, rowLimit);
      }
      return { name, rows };
    });

    return {
      sheets,
      firstSheetName: sheetNames[0],
    };
  }

  /**
   * Renders a grid-based thumbnail on a canvas showing the first 12 rows of an Excel sheet.
   * Creates a thumbnail matching the standard Excel appearance with:
   * - Gray header bar with XLSX label and sheet name
   * - Grid layout with up to 3 columns
   * - Alternating row colors (white and light gray)
   * - Standard Excel gray borders
   * @param rows - The rows of data to render (should be limited to ~12 rows)
   * @param sheetName - The name of the sheet (displayed in the header)
   * @returns A JPEG Blob of the thumbnail, or undefined if canvas rendering fails
   */
  private async drawGridThumbnail(rows: unknown[][], sheetName: string): Promise<Blob | undefined> {
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

    // Background
    ctx.fillStyle = '#f0fdf4';
    ctx.fillRect(0, 0, width, height);

    // Inner white area
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(12, 12, width - 24, height - 24);

    // Standard Excel gray header bar
    ctx.fillStyle = '#d9d9d9';
    ctx.fillRect(12, 12, width - 24, 28);
    ctx.fillStyle = '#222222';
    ctx.font = 'bold 12px Calibri, Arial, sans-serif';
    ctx.fillText('XLSX', 22, 30);

    // Sheet name in header
    const truncatedName = sheetName.length > 16 ? sheetName.slice(0, 16) + '\u2026' : sheetName;
    ctx.font = '10px Calibri, Arial, sans-serif';
    ctx.fillText(truncatedName, 62, 30);

    // Draw data grid
    const startX = 14;
    const startY = 50;
    const rowHeight = 18;
    const colWidths = [78, 78, 58];

    for (let r = 0; r < rows.length; r++) {
      const row = rows[r] as unknown[];
      const y = startY + r * rowHeight;

      // Row separator line
      ctx.strokeStyle = '#d0d0d0';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(12, y + rowHeight - 2);
      ctx.lineTo(width - 12, y + rowHeight - 2);
      ctx.stroke();

      const colCount = Math.min(Array.isArray(row) ? row.length : 0, 3);
      for (let c = 0; c < colCount; c++) {
        const cellValue = String(row[c] ?? '');
        const x = startX + colWidths.slice(0, c).reduce((a, b) => a + b, 0);
        const maxWidth = colWidths[c] - 4;

        if (r === 0) {
          // Header row with standard Excel colors
          ctx.fillStyle = '#d9d9d9';
          ctx.fillRect(x - 2, y - 2, maxWidth + 4, rowHeight);
          ctx.fillStyle = '#222222';
          ctx.font = 'bold 9px Calibri, Arial, sans-serif';
        } else {
          // Data row
          ctx.fillStyle = r % 2 === 0 ? '#fafafa' : '#ffffff';
          ctx.fillRect(x - 2, y - 2, maxWidth + 4, rowHeight);
          ctx.fillStyle = '#333333';
          ctx.font = '9px Calibri, Arial, sans-serif';
        }

        ctx.fillText(this.truncateText(ctx, cellValue, maxWidth), x, y + 11);

        // Column separator
        ctx.strokeStyle = '#d0d0d0';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(x + maxWidth + 2, startY - 4);
        ctx.lineTo(x + maxWidth + 2, height - 12);
        ctx.stroke();
      }
    }

    return new Promise<Blob | undefined>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob ?? undefined);
      }, 'image/jpeg', 0.82);
    });
  }

  /**
   * Truncates text to fit within a maximum canvas width, adding ellipsis if needed.
   * Uses canvas measurement to ensure accurate width calculation.
   * @param ctx - The canvas 2D rendering context for text measurement
   * @param text - The text to truncate
   * @param maxWidth - The maximum allowed width in pixels
   * @returns The truncated text (original or with '…' appended)
   */
  private truncateText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
    if (!text || ctx.measureText(text).width <= maxWidth) {
      return text;
    }
    let truncated = text;
    while (truncated.length > 0 && ctx.measureText(truncated + '\u2026').width > maxWidth) {
      truncated = truncated.slice(0, -1);
    }
    return truncated + '\u2026';
  }
}
