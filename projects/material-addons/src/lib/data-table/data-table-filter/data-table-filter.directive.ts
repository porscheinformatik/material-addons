import { Directive, EventEmitter, Output } from '@angular/core';
import { DataTableFilterHeader } from './data-table-filter-header.directive';
import { DataTableFilterObject } from './data-table-filter-object';

@Directive({
  selector: '[madFilter]',
  standalone: true,
})
export class DataTableFilter {
  @Output('madFilterChange') readonly filterChange = new EventEmitter<DataTableFilterObject>();

  filterables = new Map<string, DataTableFilterHeader>();

  register(filterable: DataTableFilterHeader) {
    this.filterables.set(filterable.id, filterable);
  }

  unregister(filterable: DataTableFilterHeader) {
    this.filterables.delete(filterable.id);
  }

  changeFilter() {
    this.filterChange.emit(this.createFilter());
  }

  updateFilterables(dataTableFilterObject: DataTableFilterObject | undefined) {
    if (!!dataTableFilterObject) {
      Object.entries(dataTableFilterObject).forEach(([key, value]) => {
        const filterable = this.filterables.get(key);
        if (!!filterable) {
          filterable.filterValue = value;
        }
      });
    } else {
      this.filterables.forEach((value) => (value.filterValue = null));
    }
  }

  private createFilter(): DataTableFilterObject {
    return Array.from(this.filterables.values()).reduce((result, current) => ({ ...result, [current.id]: current.filterValue }), {});
  }
}
