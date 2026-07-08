import { CommonModule } from '@angular/common';
import { Component, DOCUMENT, input, inject, computed, ChangeDetectorRef } from '@angular/core';
import { signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';

import { SheetData } from '../../models/file-preview.models';

interface FilterState {
  [colIndex: number]: Set<string>;
}

/**
 * Standalone Angular component for previewing Excel/XLSX files.
 *
 * Displays multiple sheets with tabs, search, filtering, and sorting capabilities.
 * Uses Angular signals for reactive state management instead of traditional component state.
 *
 * Features:
 * - Sheet tabs for switching between multiple sheets in a workbook
 * - Global search across all cells
 * - Column-level filtering (future implementation)
 * - Multi-column sorting (ascending/descending)
 * - Configurable row limit with visual feedback
 * - Excel-themed styling (standard gray header #d9d9d9, alternating rows)
 */
@Component({
  selector: 'mad-excel-preview',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatTableModule,
  ],
  templateUrl: './excel-preview.component.html',
  styleUrls: ['./excel-preview.component.scss'],
})
export class ExcelPreviewComponent {
  // ===== Inputs (from ExcelRenderer) =====

  /** Array of parsed Excel sheets with name and row data. Provided by ExcelRenderer. */
  sheetsData = input<SheetData[] | null>(null);

  /** Error message to display if data loading/parsing failed. Null if no error. */
  errorMessage = input<string | null>(null);

  /** Maximum number of rows to display per sheet. Default: 200. */
  rowLimit = input(200);

  private readonly doc = inject(DOCUMENT);
  private readonly cdr = inject(ChangeDetectorRef);

  // ===== Reactive State (Signals) =====

  /** Index of the currently active sheet (for sheet tabs). Default: 0 (first sheet). */
  activeSheetIndex = signal(0);

  /** Current global search term. Used to filter rows matching the search. */
  searchTerm = signal('');

  /** Index of the column being sorted, or null if no sort is applied. */
  sortColumn = signal<number | null>(null);

  /** Current sort direction: 'asc' for ascending, 'desc' for descending. */
  sortOrder = signal<'asc' | 'desc'>('asc');

  /** Column-level filter state: maps column index to set of selected filter values. */
  filters = signal<FilterState>({});

  // ===== Computed Signals (Derived State) =====

  /**
   * Computed: Extracts sheet names from sheetsData input for tab rendering.
   * @returns Array of sheet names in the workbook
   */
  sheetNames = computed(() => {
    const data = this.sheetsData();
    return data ? data.map((s) => s.name) : [];
  });

  /**
   * Computed: Gets the currently active sheet's row data.
   * @returns 2D array of cells, or empty array if sheet not found
   */
  currentSheetRows = computed(() => {
    const data = this.sheetsData();
    if (!data) return [];
    const idx = this.activeSheetIndex();
    const rows = data[idx]?.rows ?? [];
    return rows;
  });

  /**
   * Computed: Gets the total row count (excluding header) from the current sheet.
   * Uses totalRowCount from SheetData for accurate count of rows in original sheet.
   * @returns Total number of data rows in the sheet
   */
  totalRowCount = computed(() => {
    const data = this.sheetsData();
    if (!data) return 0;
    const idx = this.activeSheetIndex();
    return data[idx]?.totalRowCount ?? 0;
  });

  /**
   * Computed: Extracts header row (first row) from the current sheet.
   * @returns Array of header values (column names)
   */
  headers = computed(() => {
    const rows = this.currentSheetRows();
    return rows.length > 0 ? (rows[0] as string[]).map(String) : [];
  });

  /**
   * Computed: Applies search and column filters to all data rows.
   * Filters out the header row and applies both global search and column-specific filters.
   * @returns Filtered array of data rows (before sorting)
   */
  filteredRows = computed(() => {
    const rows = this.currentSheetRows().slice(1);
    const headers = this.headers();
    const search = this.searchTerm();
    const filterState = this.filters();

    const filtered = rows.filter((row) => {
      const rowArr = row as unknown[];

      // Column filters
      for (const [colIndexStr, selectedValues] of Object.entries(filterState)) {
        const colIndex = parseInt(colIndexStr, 10);
        const cellValue = String(rowArr[colIndex] ?? '').toLowerCase();
        if (selectedValues.size > 0 && !selectedValues.has(cellValue)) {
          return false;
        }
      }

      // Global search
      if (search) {
        const rowText = rowArr.map((cell) => String(cell ?? '').toLowerCase()).join(' ');
        if (!rowText.includes(search)) {
          return false;
        }
      }

      return true;
    });

    return filtered;
  });

  /**
   * Computed: Sorts the filtered rows by the current sort column and direction.
   * Attempts numeric sort first, falls back to string comparison.
   * @returns Sorted array of data rows
   */
  sortedRows = computed(() => {
    const rows = this.filteredRows();
    const col = this.sortColumn();
    const order = this.sortOrder();

    if (col === null) {
      return rows;
    }

    const sorted = [...rows].sort((a, b) => {
      const aVal = String(((a as unknown[]) || [])[col] ?? '').toLowerCase();
      const bVal = String(((b as unknown[]) || [])[col] ?? '').toLowerCase();

      const aNum = parseFloat(aVal);
      const bNum = parseFloat(bVal);

      if (!isNaN(aNum) && !isNaN(bNum)) {
        const result = order === 'asc' ? aNum - bNum : bNum - aNum;
        return result;
      }

      const comparison = aVal.localeCompare(bVal);
      return order === 'asc' ? comparison : -comparison;
    });

    return sorted;
  });

  /**
   * Computed: Limits the sorted and filtered rows to the rowLimit input.
   * Returns rows to actually display in the table.
   * @returns Array of rows to render in the template (respecting rowLimit)
   */
  displayRows = computed(() => {
    const rows = this.sortedRows();
    const limit = this.rowLimit();

    const display = limit ? rows.slice(0, limit) : rows;

    return display;
  });

  /**
   * Computed: Generates the row count message displayed in the table footer.
   * Shows how many rows are displayed vs. total rows in the sheet.
   * @returns Formatted message like "Showing 100 of 1000 rows"
   */
  rowLimitMessage = computed(() => {
    const display = this.displayRows().length;
    const total = this.totalRowCount();

    return `Showing ${display} of ${total} rows`;
  });

  /**
   * Computed: Determines if the "Clear Filters" button should be disabled.
   * Returns true when no filters, search, or sorting is active.
   * @returns True if reset button should be disabled
   */
  isResetDisabled = computed(() => {
    return Object.keys(this.filters()).length === 0 && !this.searchTerm() && this.sortColumn() === null;
  });

  /**
   * Computed: Creates a MatTableDataSource wrapper for the display rows.
   * This ensures mat-table properly detects and reflects data changes.
   * @returns MatTableDataSource containing the display rows
   */
  matTableDataSource = computed(() => {
    const rows = this.displayRows();
    return new MatTableDataSource(rows);
  });

  // ===== Event Handlers =====

  /**
   * Switches to a different sheet and clears all filters/search/sorting.
   * @param index - The sheet index to switch to (0-based)
   */
  selectSheet(index: number): void {
    this.activeSheetIndex.set(index);
    
    this.resetFilters(false); // Don't trigger change detection here; we'll do it below
    
    // Force re-evaluation of all dependent computed signals
    const current = this.currentSheetRows();
    const hdrs = this.headers();
    const display = this.displayRows();
    
    // Use detectChanges() for immediate re-rendering
    this.cdr.detectChanges();
  }

  /**
   * Updates the global search term when the user types in the search box.
   * Directly handles input events without two-way binding.
   * @param event - The input event from the search box
   */
  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.toLowerCase();
    
    this.searchTerm.set(value);
    
    const filtered = this.filteredRows();
    const display = this.displayRows();
    
    // Use detectChanges() for immediate re-rendering instead of markForCheck()
    this.cdr.detectChanges();
  }

  /**
   * Toggles the sort direction for a column.
   * If clicking a column that's not currently sorted, sorts ascending.
   * If clicking the currently sorted column, toggles between asc/desc.
   * @param col - The column index to sort by
   */
  toggleSort(col: number): void {
    const currentCol = this.sortColumn();
    const currentOrder = this.sortOrder();
    const headers = this.headers();

    if (currentCol === col) {
      const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';
      this.sortOrder.set(newOrder);
    } else {
      this.sortColumn.set(col);
      this.sortOrder.set('asc');
    }

    const sorted = this.sortedRows();
    const display = this.displayRows();
    
    // Use detectChanges() for immediate re-rendering instead of markForCheck()
    this.cdr.detectChanges();
  }

  /**
   * Clears all filters, search terms, and sorting.
   * Resets the table to show all rows in original order.
   * @param triggerChangeDetection - Whether to trigger change detection (default: true for direct calls)
   */
  resetFilters(triggerChangeDetection: boolean = true): void {
    this.filters.set({});
    this.searchTerm.set('');
    this.sortColumn.set(null);
    this.sortOrder.set('asc');
    
    if (triggerChangeDetection) {
      const display = this.displayRows();
      
      // Use detectChanges() for immediate re-rendering
      this.cdr.detectChanges();
    }
  }
}
