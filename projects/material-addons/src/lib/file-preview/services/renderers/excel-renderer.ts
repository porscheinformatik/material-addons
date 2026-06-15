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

interface FilterState {
  [colIndex: number]: Set<string>;
}

interface FilterContext {
  headers: string[];
  allRows: unknown[][];
  filters: FilterState;
  searchTerm: string;
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
    } catch (err) {
      console.error('[ExcelRenderer.generateThumbnail] Error:', err);
      return undefined;
    }
  }

  override async renderPreview(host: HTMLElement, source: FilePreviewItem['source'], rowLimit = 200): Promise<void> {
    if (!this.isBrowser) {
      host.innerHTML = '<div class="xlsx-placeholder">Excel preview is only available in the browser.</div>';
      console.warn('[ExcelRenderer.renderPreview] Not in browser environment');
      return;
    }

    if (!source) {
      host.innerHTML = '<div class="xlsx-placeholder">No Excel source provided.</div>';
      return;
    }

    try {
      const [xlsx, arrayBuffer] = await Promise.all([this.loadXlsx(), toArrayBuffer(source)]);

      if (!xlsx) {
        host.innerHTML = '<div class="xlsx-placeholder">Excel renderer is not available. Please install @e965/xlsx.</div>';
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
          const allRows = xlsx.utils.sheet_to_json(workbook.Sheets[name], { header: 1, defval: '' });
          contentArea.innerHTML = '';
          contentArea.appendChild(this.buildFilterableTable(allRows, this.document!, rowLimit));
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
        const allRows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[0]], { header: 1, defval: '' });
        contentArea.appendChild(this.buildFilterableTable(allRows, this.document!, rowLimit));
      }

      host.appendChild(contentArea);
    } catch (err) {
      console.error('[ExcelRenderer.renderPreview] Error during rendering:', err);
      host.innerHTML = '<div class="xlsx-placeholder">Unable to render Excel preview.</div>';
    }
  }

  private buildFilterableTable(allRows: unknown[][], doc: Document, rowLimit?: number): HTMLDivElement {
    const container = doc.createElement('div');
    container.className = 'xlsx-table-container';

    // Extract headers and data rows from full dataset
    const headers = allRows.length > 0 ? (allRows[0] as string[]).map(String) : [];
    const dataRows = allRows.slice(1);

    // Pre-extract unique values for all columns from FULL original data
    const uniqueValuesByColumn: Map<number, Set<string>> = new Map();
    dataRows.forEach((row) => {
      const rowArr = row as unknown[];
      rowArr.forEach((cell, colIndex) => {
        const cellValue = String(cell ?? '').toLowerCase();
        if (!uniqueValuesByColumn.has(colIndex)) {
          uniqueValuesByColumn.set(colIndex, new Set());
        }
        uniqueValuesByColumn.get(colIndex)!.add(cellValue);
      });
    });

    // Filter and sort state
    const filters: FilterState = {};
    let searchTerm = '';
    let sortColumn: number | null = null;
    let sortOrder: 'asc' | 'desc' = 'asc';

    // Create toolbar
    const toolbar = doc.createElement('div');
    toolbar.className = 'xlsx-filter-toolbar';

    // Global search box
    const searchBox = doc.createElement('input');
    searchBox.type = 'text';
    searchBox.placeholder = '🔍 Search all cells...';
    searchBox.className = 'xlsx-search-box';
    searchBox.setAttribute('aria-label', 'Search spreadsheet');

    toolbar.appendChild(searchBox);

    // Reset filters button
    const resetBtn = doc.createElement('button');
    resetBtn.textContent = 'Clear Filters';
    resetBtn.className = 'xlsx-reset-button';
    resetBtn.type = 'button';
    resetBtn.disabled = true;

    toolbar.appendChild(resetBtn);
    container.appendChild(toolbar);

    // Table wrapper
    const tableWrapper = doc.createElement('div');
    tableWrapper.className = 'xlsx-table-wrapper';
    container.appendChild(tableWrapper);

    // Create and update table
    const updateTable = (): void => {
      const filteredRows = this.applyFilters(dataRows, headers, filters, searchTerm);
      const sortedRows = this.applySorting(filteredRows, sortColumn, sortOrder);
      
      // Slice to rowLimit for display
      const displayRows = rowLimit ? sortedRows.slice(0, rowLimit) : sortedRows;
      const totalFiltered = sortedRows.length;
      const totalDataRows = dataRows.length;
      
      // Clear and rebuild table
      tableWrapper.innerHTML = '';
      tableWrapper.appendChild(
        this.buildTableWithFilters(
          displayRows,
          headers,
          { filteredCount: totalFiltered, displayCount: displayRows.length, totalCount: totalDataRows },
          filters,
          uniqueValuesByColumn,
          doc,
          updateTable,
          {
            sortColumn,
            sortOrder,
            onSort: (col: number, order: 'asc' | 'desc') => {
              sortColumn = col;
              sortOrder = order;
              updateTable();
            },
          },
        ),
      );
      resetBtn.disabled = Object.keys(filters).length === 0 && !searchTerm;
    };

    // Search handler
    searchBox.addEventListener('input', (e) => {
      searchTerm = (e.target as HTMLInputElement).value.toLowerCase();
      updateTable();
    });

    // Reset handler
    resetBtn.addEventListener('click', () => {
      Object.keys(filters).forEach((key) => {
        delete filters[parseInt(key, 10)];
      });
      searchBox.value = '';
      searchTerm = '';
      sortColumn = null;
      sortOrder = 'asc';
      updateTable();
    });

    // Initial render
    updateTable();

    return container;
  }

  private applyFilters(rows: unknown[][], headers: string[], filters: FilterState, searchTerm: string): unknown[][] {
    return rows.filter((row) => {
      const rowArr = row as unknown[];

      // Check column filters
      for (const [colIndexStr, selectedValues] of Object.entries(filters)) {
        const colIndex = parseInt(colIndexStr, 10);
        const cellValue = String(rowArr[colIndex] ?? '').toLowerCase();
        if (selectedValues.size > 0 && !selectedValues.has(cellValue)) {
          return false;
        }
      }

      // Check global search
      if (searchTerm) {
        const rowText = rowArr.map((cell) => String(cell ?? '').toLowerCase()).join(' ');
        if (!rowText.includes(searchTerm)) {
          return false;
        }
      }

      return true;
    });
  }

  private applySorting(rows: unknown[][], sortColumn: number | null, sortOrder: 'asc' | 'desc'): unknown[][] {
    if (sortColumn === null) {
      return rows;
    }

    return [...rows].sort((a, b) => {
      const aVal = String(((a as unknown[]) || [])[sortColumn] ?? '').toLowerCase();
      const bVal = String(((b as unknown[]) || [])[sortColumn] ?? '').toLowerCase();

      // Try numeric sort first
      const aNum = parseFloat(aVal);
      const bNum = parseFloat(bVal);

      if (!isNaN(aNum) && !isNaN(bNum)) {
        return sortOrder === 'asc' ? aNum - bNum : bNum - aNum;
      }

      // Fall back to string sort
      const comparison = aVal.localeCompare(bVal);
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  private buildTableWithFilters(
    filteredRows: unknown[][],
    headers: string[],
    rowCounts: { filteredCount: number; displayCount: number; totalCount: number },
    filters: FilterState,
    uniqueValuesByColumn: Map<number, Set<string>>,
    doc: Document,
    onFilterChange?: () => void,
    sortState?: { sortColumn: number | null; sortOrder: 'asc' | 'desc'; onSort?: (col: number, order: 'asc' | 'desc') => void },
  ): HTMLElement {
    const wrapper = doc.createElement('div');

    const table = doc.createElement('table');
    table.className = 'xlsx-table';

    // Build header row with filter dropdowns
    const thead = doc.createElement('thead');
    const headerRow = doc.createElement('tr');
    headerRow.className = 'xlsx-header-row';

    headers.forEach((header, colIndex) => {
      const th = doc.createElement('th');
      th.className = 'xlsx-header-cell';

      const headerContent = doc.createElement('div');
      headerContent.className = 'xlsx-header-content';

      const headerText = doc.createElement('span');
      headerText.textContent = header;
      headerContent.appendChild(headerText);

      // Sort button
      const sortBtn = doc.createElement('button');
      sortBtn.className = 'xlsx-sort-btn';
      sortBtn.type = 'button';
      sortBtn.setAttribute('aria-label', `Sort ${header}`);
      
      // Show sort indicator
      if (sortState?.sortColumn === colIndex) {
        sortBtn.textContent = sortState.sortOrder === 'asc' ? '▲' : '▼';
        sortBtn.classList.add('xlsx-sort-btn--active');
      } else {
        sortBtn.textContent = '⇅';
      }

      sortBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (sortState?.onSort) {
          const newOrder = sortState.sortColumn === colIndex && sortState.sortOrder === 'asc' ? 'desc' : 'asc';
          sortState.onSort(colIndex, newOrder);
        }
      });

      headerContent.appendChild(sortBtn);

      // Filter button
      const filterBtn = doc.createElement('button');
      filterBtn.className = 'xlsx-filter-btn' + (filters[colIndex] ? ' xlsx-filter-btn--active' : '');
      filterBtn.textContent = '⬇️';
      filterBtn.type = 'button';
      filterBtn.setAttribute('aria-label', `Filter ${header}`);

      // Get unique values for this column
      const colValues = Array.from(uniqueValuesByColumn.get(colIndex) || []).sort();

      // Filter dropdown (initially hidden)
      const filterMenu = this.createFilterMenu(colIndex, colValues, filters, doc, onFilterChange);

      filterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = filterMenu.style.display === 'block';
        // Close all other menus
        headerRow.querySelectorAll('.xlsx-filter-menu').forEach((menu) => {
          (menu as HTMLElement).style.display = 'none';
        });
        filterMenu.style.display = isVisible ? 'none' : 'block';
      });

      headerContent.appendChild(filterBtn);
      th.appendChild(headerContent);
      th.appendChild(filterMenu);
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Build data rows
    const tbody = doc.createElement('tbody');
    filteredRows.forEach((row) => {
      const tr = doc.createElement('tr');
      (row as unknown[]).forEach((cell) => {
        const td = doc.createElement('td');
        td.textContent = String(cell ?? '');
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    // Add row count summary
    if (filteredRows.length === 0) {
      const tfoot = doc.createElement('tfoot');
      const tr = doc.createElement('tr');
      const td = doc.createElement('td');
      td.setAttribute('colspan', String(headers.length));
      td.className = 'xlsx-no-results';
      td.textContent = 'No rows match the applied filters';
      tr.appendChild(td);
      tfoot.appendChild(tr);
      table.appendChild(tfoot);
    } else {
      const tfoot = doc.createElement('tfoot');
      const tr = doc.createElement('tr');
      const td = doc.createElement('td');
      td.setAttribute('colspan', String(headers.length));
      td.className = 'xlsx-row-limit-notice';
      
      // Build message based on counts
      let message = `Showing ${rowCounts.displayCount} of ${rowCounts.filteredCount} rows`;
      if (rowCounts.filteredCount < rowCounts.totalCount) {
        message += ` (filtered from ${rowCounts.totalCount} total)`;
      }
      
      td.textContent = message;
      tr.appendChild(td);
      tfoot.appendChild(tr);
      table.appendChild(tfoot);
    }

    wrapper.appendChild(table);
    return wrapper;
  }

  private createFilterMenu(
    colIndex: number,
    uniqueValues: string[],
    filters: FilterState,
    doc: Document,
    onFilterChange?: () => void,
  ): HTMLElement {
    const menu = doc.createElement('div');
    menu.className = 'xlsx-filter-menu';
    menu.style.display = 'none';

    // "Select All" checkbox
    const selectAllLabel = doc.createElement('label');
    selectAllLabel.className = 'xlsx-filter-checkbox';
    const selectAllInput = doc.createElement('input');
    selectAllInput.type = 'checkbox';
    selectAllInput.checked = !filters[colIndex] || filters[colIndex].size === 0;
    selectAllLabel.appendChild(selectAllInput);
    selectAllLabel.appendChild(doc.createTextNode('Select All'));
    menu.appendChild(selectAllLabel);

    // Divider
    const divider = doc.createElement('div');
    divider.className = 'xlsx-filter-divider';
    menu.appendChild(divider);

    // Value checkboxes
    uniqueValues.forEach((value) => {
      const label = doc.createElement('label');
      label.className = 'xlsx-filter-checkbox';
      const input = doc.createElement('input');
      input.type = 'checkbox';
      input.value = value;
      input.checked = !filters[colIndex] || filters[colIndex].has(value);

      input.addEventListener('change', () => {
        if (!filters[colIndex]) {
          filters[colIndex] = new Set(uniqueValues);
        }

        if (input.checked) {
          filters[colIndex].add(value);
        } else {
          filters[colIndex].delete(value);
        }

        // If all selected, delete the filter
        if (filters[colIndex].size === uniqueValues.length) {
          delete filters[colIndex];
        }

        // Update select all checkbox
        selectAllInput.checked = filters[colIndex] === undefined || filters[colIndex].size === uniqueValues.length;
        
        // Trigger table update
        onFilterChange?.();
      });

      label.appendChild(input);
      label.appendChild(doc.createTextNode(value || '(empty)'));
      menu.appendChild(label);
    });

    // Select All handler
    selectAllInput.addEventListener('change', () => {
      if (selectAllInput.checked) {
        delete filters[colIndex];
        menu.querySelectorAll('input[type="checkbox"]:not(:first-of-type)').forEach((input) => {
          (input as HTMLInputElement).checked = true;
        });
      } else {
        filters[colIndex] = new Set();
        menu.querySelectorAll('input[type="checkbox"]:not(:first-of-type)').forEach((input) => {
          (input as HTMLInputElement).checked = false;
        });
      }
      
      // Trigger table update
      onFilterChange?.();
    });

    return menu;
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
      const result = (await import('@e965/xlsx')) as unknown as XlsxModule;
      return result;
    } catch (err) {
      console.error('[ExcelRenderer.loadXlsx] Dynamic import FAILED');
      console.error('[ExcelRenderer.loadXlsx] Error type:', err instanceof Error ? err.constructor.name : typeof err);
      console.error('[ExcelRenderer.loadXlsx] Error message:', err instanceof Error ? err.message : String(err));
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
      canvas.toBlob((blob) => {
        resolve(blob ?? undefined);
      }, 'image/jpeg', 0.82);
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
