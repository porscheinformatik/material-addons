import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataTableColumn } from '../data-table-column';
import { DataTableColumnDefinition, DataTableColumnDefinitionChange, DataTableDialogData } from '../data-table-column-definition';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'mad-data-table-columns-modal.component',
  templateUrl: './data-table-columns-modal.component.html',
  styleUrls: ['./data-table-columns-modal.component.scss'],
})
export class DataTableColumnsModalComponent implements OnInit {
  definition: DataTableColumnDefinition;
  searchFilter: string;
  selectedColumns: DataTableColumn[] = [];
  availableColumns: DataTableColumn[] = [];
  filteredAvailableColumns: DataTableColumn[] = [];

  constructor(
    public dialogRef: MatDialogRef<DataTableColumnsModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: DataTableDialogData,
  ) {}

  ngOnInit(): void {
    this.definition = this.data.definition;
    for (const column of this.data.allColumns) {
      const columnId = column.id;
      const selectedColumnIds: string[] = this.definition.displayedColumns.map(col => col.id);
      if (selectedColumnIds.includes(columnId)) {
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
      const itemIndex = this.findMatchingItemIndex(event.previousContainer, event.item);
      transferArrayItem(event.previousContainer.data, event.container.data, itemIndex, event.currentIndex);
      this.clearFilterValue();
      this.availableColumns.sort((a, b) => a.label.localeCompare(b.label));
    }
  }

  onSave(): void {
    this.definition.displayedColumns = this.selectedColumns;
    const saveChange: DataTableColumnDefinitionChange = {
      action: 'SAVE',
      definition: this.definition,
    };
    this.dialogRef.close(saveChange);
  }

  onDelete(): void {
    const deleteChange: DataTableColumnDefinitionChange = {
      action: 'DELETE',
      definition: this.definition,
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

  findMatchingItemIndex(previousContainer: CdkDropList, item: CdkDrag): number {
    const itemId = item.element.nativeElement.id;
    const previousContainerItems = [...previousContainer.data] as DataTableColumn[];
    if (previousContainerItems?.length < 1) {
      return 0;
    }
    for (let itemIndex = 0; itemIndex < previousContainerItems.length; itemIndex++) {
      if (previousContainerItems[itemIndex].id === itemId) {
        return itemIndex;
      }
    }
    return 0;
  }

  clearFilterValue(): void {
    this.searchFilter = '';
    this.filteredAvailableColumns = [...this.availableColumns];
  }
}
