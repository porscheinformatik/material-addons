import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

import { FilePreviewItem } from '../../models/file-preview.models';
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
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  supports(mimeType: string, extension: string): boolean {
    return this.supportedTypes.has(mimeType.toLowerCase()) || this.supportedExtensions.has(extension);
  }

  async generateThumbnail(source: FilePreviewItem['source']): Promise<Blob | undefined> {
    if (!this.isBrowser || !this.document || !source) {
      return undefined;
    }

    try {
      const [xlsx, arrayBuffer] = await Promise.all([this.loadXlsx(), toArrayBuffer(source)]);
      if (!xlsx) {
        return undefined;
      }

      const workbook = xlsx.read(new Uint8Array(arrayBuffer), { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      if (!firstSheetName) {
        return undefined;
      }

      const worksheet = workbook.Sheets[firstSheetName];
      const rows = xlsx.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

      return await this.drawGridThumbnail(rows.slice(0, 12), firstSheetName);
    } catch {
      return undefined;
    }
  }

  override async renderPreview(host: HTMLElement, source: FilePreviewItem['source']): Promise<void> {
    if (!this.isBrowser) {
      host.innerHTML = '<div class="xlsx-placeholder">Excel preview is only available in the browser.</div>';
      return;
    }

    if (!source) {
      host.innerHTML = '<div class="xlsx-placeholder">No Excel source provided.</div>';
      return;
    }

    try {
      const [xlsx, arrayBuffer] = await Promise.all([this.loadXlsx(), toArrayBuffer(source)]);

      if (!xlsx) {
        host.innerHTML = '<div class="xlsx-placeholder">Excel renderer is not available. Please install xlsx.</div>';
        return;
      }

      const workbook = xlsx.read(new Uint8Array(arrayBuffer), { type: 'array' });
      const sheetNames = workbook.SheetNames;

      if (sheetNames.length === 0) {
        host.innerHTML = '<div class="xlsx-placeholder">This workbook contains no sheets.</div>';
        return;
      }

      host.innerHTML = '';
      host.classList.add('xlsx-preview-host');

      const contentArea = this.document!.createElement('div');
      contentArea.className = 'xlsx-content';

      if (sheetNames.length > 1) {
        const tabBar = this.document!.createElement('div');
        tabBar.className = 'xlsx-tabs';
        tabBar.setAttribute('role', 'tablist');

        const renderSheet = (name: string): void => {
          const rows = xlsx.utils.sheet_to_json(workbook.Sheets[name], { header: 1, defval: '' });
          contentArea.innerHTML = '';
          contentArea.appendChild(this.buildTable(rows));
        };

        sheetNames.forEach((name, i) => {
          const tab = this.document!.createElement('button');
          tab.className = 'xlsx-tab' + (i === 0 ? ' xlsx-tab--active' : '');
          tab.textContent = name;
          tab.type = 'button';
          tab.setAttribute('role', 'tab');
          tab.setAttribute('aria-selected', i === 0 ? 'true' : 'false');

          tab.addEventListener('click', () => {
            tabBar.querySelectorAll('.xlsx-tab').forEach((t) => {
              t.classList.remove('xlsx-tab--active');
              t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('xlsx-tab--active');
            tab.setAttribute('aria-selected', 'true');
            renderSheet(name);
          });

          tabBar.appendChild(tab);
        });

        renderSheet(sheetNames[0]);
        host.appendChild(tabBar);
      } else {
        const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[0]], { header: 1, defval: '' });
        contentArea.appendChild(this.buildTable(rows));
      }

      host.appendChild(contentArea);
    } catch {
      host.innerHTML = '<div class="xlsx-placeholder">Unable to render Excel preview.</div>';
    }
  }

  private buildTable(rows: unknown[][]): HTMLTableElement {
    const doc = this.document!;
    const table = doc.createElement('table');
    table.className = 'xlsx-table';

    rows.forEach((row, rowIndex) => {
      const tr = doc.createElement('tr');
      (row as unknown[]).forEach((cell) => {
        const cellEl = rowIndex === 0 ? doc.createElement('th') : doc.createElement('td');
        // Use textContent to safely render cell values without XSS risk
        cellEl.textContent = String(cell ?? '');
        tr.appendChild(cellEl);
      });
      table.appendChild(tr);
    });

    return table;
  }

  private async loadXlsx(): Promise<XlsxModule | null> {
    try {
      return (await import('xlsx')) as unknown as XlsxModule;
    } catch {
      return null;
    }
  }

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

    // Green header bar (Excel brand colour)
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(12, 12, width - 24, 28);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Arial, sans-serif';
    ctx.fillText('XLSX', 22, 30);

    // Sheet name in header
    const truncatedName = sheetName.length > 16 ? sheetName.slice(0, 16) + '\u2026' : sheetName;
    ctx.font = '10px Arial, sans-serif';
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
      ctx.strokeStyle = '#e5e7eb';
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
          // Header row highlight
          ctx.fillStyle = '#dcfce7';
          ctx.fillRect(x - 2, y - 2, maxWidth + 4, rowHeight);
          ctx.fillStyle = '#14532d';
          ctx.font = 'bold 9px Arial, sans-serif';
        } else {
          ctx.fillStyle = '#374151';
          ctx.font = '9px Arial, sans-serif';
        }

        ctx.fillText(this.truncateText(ctx, cellValue, maxWidth), x, y + 11);

        // Column separator
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(x + maxWidth + 2, startY - 4);
        ctx.lineTo(x + maxWidth + 2, height - 12);
        ctx.stroke();
      }
    }

    return new Promise<Blob | undefined>((resolve) => {
      canvas.toBlob((blob) => resolve(blob ?? undefined), 'image/jpeg', 0.82);
    });
  }

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
