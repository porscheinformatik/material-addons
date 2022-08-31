import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataTableColumn } from '../data-table-column';
import { DataTableColumnDefinition, DataTableColumnDefinitionChange, DataTableDialogData } from '../data-table-column-definition';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'mad-data-table-columns-modal.component',
  templateUrl: './data-table-columns-modal.component.html',
  styleUrls: ['./data-table-columns-modal.component.scss'],
})
export class DataTableColumnsModalComponent implements OnInit {
  allColumns: DataTableColumn[] = [];
  definition: DataTableColumnDefinition;
  searchFilter: string;
  selectedColumns: DataTableColumn[] = [];
  availableColumns: DataTableColumn[] = [];
  filteredAvailableColumns: DataTableColumn[] = [];
  deleteDefinitionAllowed: boolean;

  constructor(
    public dialogRef: MatDialogRef<DataTableColumnsModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: DataTableDialogData,
  ) {}

  ngOnInit(): void {
    this.definition = this.data.definition;
    for (const column of this.data.allColumns) {
      const columnId = column.id;
      if (this.definition.displayedColumnIds?.includes(columnId)) {
        this.selectedColumns.push(column);
      } else {
        this.availableColumns.push(column);
      }
    }
    this.clearFilterValue();
  }

  onDrop(event: CdkDragDrop<DataTableColumn[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
    this.availableColumns.sort((a, b) => a.label.localeCompare(b.label));
    this.clearFilterValue();
  }

  onSave(): void {
    const saveChange: DataTableColumnDefinitionChange = {
      action: 'SAVE',
      definitionId: this.definition.id,
      selectedColumns: this.selectedColumns,
    };
    this.dialogRef.close(saveChange);
  }

  onDelete(): void {
    const deleteChange: DataTableColumnDefinitionChange = {
      action: 'DELETE',
      definitionId: this.definition.id,
    };
    this.dialogRef.close(deleteChange);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  updateFilterValue(): void {
    if (this.searchFilter?.length > 0) {
      this.filteredAvailableColumns = this.availableColumns.filter(c => c.label.toLowerCase().includes(this.searchFilter.toLowerCase()));
    } else {
      this.filteredAvailableColumns = [...this.availableColumns];
    }
  }

  matchesFilter(column: DataTableColumn): boolean {
    if (this.searchFilter?.length > 0) {
      return column.label.toLowerCase().includes(this.searchFilter.toLowerCase());
    }
    return true;
  }

  clearFilterValue(): void {
    this.searchFilter = '';
    this.filteredAvailableColumns = [...this.availableColumns];
  }
}
