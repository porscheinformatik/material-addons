import { Directive, output } from '@angular/core';
import { DataTableFilterHeader } from './data-table-filter-header.directive';
import { DataTableFilterObject } from './data-table-filter-object';

@Directive({
  selector: '[madFilter]',
  standalone: true,
})
export class DataTableFilter {
  readonly filterChange = output<DataTableFilterObject>({ alias: 'madFilterChange' });

  readonly filterables = new Map<string, DataTableFilterHeader>();

  register(filterable: DataTableFilterHeader): void {
    this.filterables.set(filterable.id, filterable);
  }

  unregister(filterable: DataTableFilterHeader): void {
    this.filterables.delete(filterable.id);
  }

  changeFilter(): void {
    this.filterChange.emit(this.createFilter());
  }

  updateFilterables(dataTableFilterObject: DataTableFilterObject | undefined): void {
    if (!!dataTableFilterObject) {
      Object.entries(dataTableFilterObject).forEach(([key, value]) => {
        const filterable = this.filterables.get(key);
        if (!!filterable) {
          filterable.filterValue = value as string | null;
        }
      });
    } else {
      this.filterables.forEach((value) => (value.filterValue = null));
    }
  }

  getActiveFilterCount(): number {
    return Array.from(this.filterables.values()).filter((value) => !!value.filterValue).length;
  }

  private createFilter(): DataTableFilterObject {
    return Array.from(this.filterables.values()).reduce((result, current) => ({ ...result, [current.id]: current.filterValue }), {});
  }
}
