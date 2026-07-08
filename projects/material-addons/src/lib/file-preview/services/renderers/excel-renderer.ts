import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, EnvironmentInjector, Renderer2, createComponent } from '@angular/core';

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

  // ──────────────────────────────────────────────────────────────
  // Thumbnail Generation
  // ──────────────────────────────────────────────────────────────
  private readonly THUMBNAIL_ROWS_TO_DISPLAY = 12;
  private readonly PREVIEW_DEFAULT_ROW_LIMIT = 200;

  // ──────────────────────────────────────────────────────────────
  // Thumbnail Canvas Dimensions
  // ──────────────────────────────────────────────────────────────
  private readonly THUMBNAIL_WIDTH_PX = 240;
  private readonly THUMBNAIL_HEIGHT_PX = 320;
  private readonly THUMBNAIL_PADDING_PX = 12;

  // ──────────────────────────────────────────────────────────────
  // Thumbnail Colors
  // ──────────────────────────────────────────────────────────────
  private readonly THUMBNAIL_BACKGROUND_COLOR = '#f0fdf4';
  private readonly THUMBNAIL_HEADER_COLOR = '#d9d9d9';
  private readonly THUMBNAIL_HEADER_TEXT_COLOR = '#222222';
  private readonly THUMBNAIL_DATA_ROW_EVEN_BG = '#fafafa';
  private readonly THUMBNAIL_DATA_ROW_ODD_BG = '#ffffff';
  private readonly THUMBNAIL_DATA_TEXT_COLOR = '#333333';
  private readonly GRID_BORDER_COLOR = '#d0d0d0';

  // ──────────────────────────────────────────────────────────────
  // Thumbnail Typography
  // ──────────────────────────────────────────────────────────────
  private readonly THUMBNAIL_HEADER_FONT = 'bold 12px Calibri, Arial, sans-serif';
  private readonly THUMBNAIL_DATA_FONT = '9px Calibri, Arial, sans-serif';

  // ──────────────────────────────────────────────────────────────
  // Thumbnail Header Layout
  // ──────────────────────────────────────────────────────────────
  private readonly THUMBNAIL_HEADER_HEIGHT_PX = 28;
  private readonly THUMBNAIL_HEADER_LABEL_X_PX = 22;
  private readonly THUMBNAIL_HEADER_LABEL_Y_PX = 30;
  private readonly THUMBNAIL_SHEET_NAME_X_PX = 62;
  private readonly THUMBNAIL_SHEET_NAME_MAX_LENGTH = 16;

  // ──────────────────────────────────────────────────────────────
  // Grid Layout
  // ──────────────────────────────────────────────────────────────
  private readonly GRID_START_X_PX = 14;
  private readonly GRID_START_Y_PX = 50;
  private readonly GRID_ROW_HEIGHT_PX = 18;
  private readonly GRID_COL_WIDTHS_PX = [78, 78, 58];
  private readonly GRID_MAX_COLUMNS = 3;
  private readonly GRID_CELL_PADDING_PX = 4;
  private readonly GRID_BORDER_WIDTH = 0.5;
  private readonly GRID_LEFT_PADDING_PX = 12;
  private readonly GRID_TEXT_Y_OFFSET_PX = 11;

  // ──────────────────────────────────────────────────────────────
  // Thumbnail Export Quality
  // ──────────────────────────────────────────────────────────────
  private readonly THUMBNAIL_JPEG_QUALITY = 0.82;

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
  private readonly renderer = inject(Renderer2, { optional: true });
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
      const parsed = await this.parseExcelSheets(source, this.THUMBNAIL_ROWS_TO_DISPLAY);
      if (!parsed || parsed.sheets.length === 0) {
        return undefined;
      }

      const firstSheet = parsed.sheets[0];
      return await this.drawExcelGridThumbnail(firstSheet.rows, firstSheet.name);
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
    if (this.renderer) {
      this.renderer.setProperty(host, 'innerHTML', '');
    } else {
      host.innerHTML = '';
    }

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
        // Parse sheets with row limit applied for memory efficiency
        // Total row count is captured separately so component can show accurate total
        const parsed = await this.parseExcelSheets(source, rowLimit);

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
    if (this.renderer) {
      this.renderer.appendChild(host, componentRef.location.nativeElement);
    } else {
      host.appendChild(componentRef.location.nativeElement);
    }

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
  private async loadXlsxModule(): Promise<XlsxModule | null> {
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
   * Parses all sheets from an Excel file source with optional row limiting.
   * Centralizes shared parsing logic used by both thumbnail generation and full preview.
   * Extracts worksheet data from workbook and applies row limit for memory efficiency.
   * 
   * @param source - The Excel file source (URL, Blob, ArrayBuffer, etc.)
   * @param rowLimit - Optional limit on rows per sheet (applied after parsing)
   * @returns Object with parsed sheets array and first sheet name, or null if parsing fails
   */
  private async parseExcelSheets(
    source: FilePreviewItem['source'],
    rowLimit?: number,
  ): Promise<{ sheets: SheetData[]; firstSheetName: string } | null> {
    const [xlsx, arrayBuffer] = await Promise.all([this.loadXlsxModule(), toArrayBuffer(source)]);

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
      const totalRowCount = rows.length - 1;  // Capture total BEFORE slicing (exclude header row)
      
      if (rowLimit) {
        rows = rows.slice(0, rowLimit);   // Apply limit for memory efficiency
      }
      
      return { name, rows, totalRowCount };
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
   * 
   * Resource Management:
   * - Canvas is created, rendered, and cleaned up within this method
   * - toBlob() is called to extract the image data
   * - Canvas is immediately cleaned up after blob is extracted to prevent memory leaks
   * 
   * @param rows - The rows of data to render (should be limited to ~12 rows)
   * @param sheetName - The name of the sheet (displayed in the header)
   * @returns A JPEG Blob of the thumbnail, or undefined if canvas rendering fails
   */
  private async drawExcelGridThumbnail(rows: unknown[][], sheetName: string): Promise<Blob | undefined> {
    if (!this.document) {
      return undefined;
    }

    let canvas: HTMLCanvasElement | undefined;
    try {
      canvas = this.document.createElement('canvas');
      canvas.width = this.THUMBNAIL_WIDTH_PX;
      canvas.height = this.THUMBNAIL_HEIGHT_PX;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return undefined;
      }

      // Background
      ctx.fillStyle = this.THUMBNAIL_BACKGROUND_COLOR;
      ctx.fillRect(0, 0, this.THUMBNAIL_WIDTH_PX, this.THUMBNAIL_HEIGHT_PX);

      // Inner white area
      ctx.fillStyle = this.THUMBNAIL_DATA_ROW_ODD_BG;
      ctx.fillRect(
        this.THUMBNAIL_PADDING_PX,
        this.THUMBNAIL_PADDING_PX,
        this.THUMBNAIL_WIDTH_PX - this.THUMBNAIL_PADDING_PX * 2,
        this.THUMBNAIL_HEIGHT_PX - this.THUMBNAIL_PADDING_PX * 2
      );

      // Standard Excel gray header bar
      ctx.fillStyle = this.THUMBNAIL_HEADER_COLOR;
      ctx.fillRect(
        this.THUMBNAIL_PADDING_PX,
        this.THUMBNAIL_PADDING_PX,
        this.THUMBNAIL_WIDTH_PX - this.THUMBNAIL_PADDING_PX * 2,
        this.THUMBNAIL_HEADER_HEIGHT_PX
      );
      ctx.fillStyle = this.THUMBNAIL_HEADER_TEXT_COLOR;
      ctx.font = this.THUMBNAIL_HEADER_FONT;
      ctx.fillText('XLSX', this.THUMBNAIL_HEADER_LABEL_X_PX, this.THUMBNAIL_HEADER_LABEL_Y_PX);

      // Sheet name in header
      const truncatedName = sheetName.length > this.THUMBNAIL_SHEET_NAME_MAX_LENGTH
        ? sheetName.slice(0, this.THUMBNAIL_SHEET_NAME_MAX_LENGTH) + '\u2026'
        : sheetName;
      ctx.font = '10px Calibri, Arial, sans-serif';
      ctx.fillText(truncatedName, this.THUMBNAIL_SHEET_NAME_X_PX, this.THUMBNAIL_HEADER_LABEL_Y_PX);

      // Draw data grid
      const rowHeight = this.GRID_ROW_HEIGHT_PX;
      const colWidths = this.GRID_COL_WIDTHS_PX;

      for (let r = 0; r < rows.length; r++) {
        const row = rows[r] as unknown[];
        const y = this.GRID_START_Y_PX + r * rowHeight;

        // Row separator line
        ctx.strokeStyle = this.GRID_BORDER_COLOR;
        ctx.lineWidth = this.GRID_BORDER_WIDTH;
        ctx.beginPath();
        ctx.moveTo(this.THUMBNAIL_PADDING_PX, y + rowHeight - 2);
        ctx.lineTo(this.THUMBNAIL_WIDTH_PX - this.THUMBNAIL_PADDING_PX, y + rowHeight - 2);
        ctx.stroke();

        const colCount = Math.min(Array.isArray(row) ? row.length : 0, this.GRID_MAX_COLUMNS);
        for (let c = 0; c < colCount; c++) {
          const cellValue = String(row[c] ?? '');
          const x = this.GRID_START_X_PX + colWidths.slice(0, c).reduce((a, b) => a + b, 0);
          const maxWidth = colWidths[c] - this.GRID_CELL_PADDING_PX;

          if (r === 0) {
            // Header row with standard Excel colors
            ctx.fillStyle = this.THUMBNAIL_HEADER_COLOR;
            ctx.fillRect(x - 2, y - 2, maxWidth + 4, rowHeight);
            ctx.fillStyle = this.THUMBNAIL_HEADER_TEXT_COLOR;
            ctx.font = 'bold 9px Calibri, Arial, sans-serif';
          } else {
            // Data row
            ctx.fillStyle = r % 2 === 0 ? this.THUMBNAIL_DATA_ROW_EVEN_BG : this.THUMBNAIL_DATA_ROW_ODD_BG;
            ctx.fillRect(x - 2, y - 2, maxWidth + 4, rowHeight);
            ctx.fillStyle = this.THUMBNAIL_DATA_TEXT_COLOR;
            ctx.font = this.THUMBNAIL_DATA_FONT;
          }

          ctx.fillText(this.truncateTextToCanvasWidth(ctx, cellValue, maxWidth), x, y + this.GRID_TEXT_Y_OFFSET_PX);

          // Column separator
          ctx.strokeStyle = this.GRID_BORDER_COLOR;
          ctx.lineWidth = this.GRID_BORDER_WIDTH;
          ctx.beginPath();
          ctx.moveTo(x + maxWidth + 2, this.GRID_START_Y_PX - 4);
          ctx.lineTo(x + maxWidth + 2, this.THUMBNAIL_HEIGHT_PX - 12);
          ctx.stroke();
        }
      }

      // Return blob with proper cleanup after extraction
      return await new Promise<Blob | undefined>((resolve) => {
        canvas!.toBlob((blob) => {
          // Clean up canvas resources immediately after blob is extracted
          // This prevents accumulated canvas objects from staying in memory
          if (canvas) {
            canvas.width = 0;
            canvas.height = 0;
            canvas = undefined;
          }
          resolve(blob ?? undefined);
        }, 'image/jpeg', this.THUMBNAIL_JPEG_QUALITY);
      });
    } catch {
      return undefined;
    } finally {
      // Best-effort cleanup if an error occurs before toBlob
      if (canvas) {
        try {
          canvas.width = 0;
          canvas.height = 0;
        } catch {
          // Ignore cleanup errors
        }
      }
    }
  }

  /**
   * Truncates text to fit within a maximum canvas width, adding ellipsis if needed.
   * Uses canvas text measurement to ensure accurate width calculation for grid cells.
   * @param ctx - The canvas 2D rendering context for text measurement
   * @param text - The text to truncate
   * @param maxWidth - The maximum allowed width in pixels
   * @returns The truncated text (original or with '…' appended)
   */
  private truncateTextToCanvasWidth(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
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
