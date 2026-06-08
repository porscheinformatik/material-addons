import { Component, EventEmitter, Output } from '@angular/core';
import { DataTableFilterOption } from '../data-table-filter-options';

import { MatIconModule } from '@angular/material/icon';
import { DataTableFilterDialogComponent } from './data-table-filter-dialog/data-table-filter-dialog.component';
import { OverlayModule } from '@angular/cdk/overlay';

@Component({
  selector: 'mad-data-table-filter',
  templateUrl: './data-table-filter.component.html',
  styleUrls: ['./data-table-filter.component.scss'],
  imports: [MatIconModule, DataTableFilterDialogComponent, OverlayModule],
})
export class FilterComponent {
  @Output() filterValueChange: EventEmitter<string | null> = new EventEmitter();

  isHovered: boolean;
  isActive: boolean;
  showFilterDialog: boolean;

  filterValue: string | null;
  filterOptions: DataTableFilterOption[];

  constructor() {}

  toggleFilter(showFilterDialog: boolean) {
    this.showFilterDialog = showFilterDialog;
  }

  onFilterChanged(filterValue: string | null) {
    this.isActive = !!filterValue;
    this.filterValue = filterValue;
    this.filterValueChange.emit(this.filterValue);
  }

  get opacity() {
    return this.isActive ? '1' : this.isHovered || this.showFilterDialog ? '0.54' : '0';
  }
}
