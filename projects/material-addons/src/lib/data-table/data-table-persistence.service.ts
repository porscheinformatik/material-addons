import { Sort } from "@angular/material/sort";
import { DataTableFilterObject } from "./data-table-filter/data-table-filter-object";
import { Injectable, Optional, SkipSelf } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class DataTablePersistenceService {
  sortKey = "sort";
  filterKey = "filter";
  pageSizeKey = "pageSize";

  saveSort(tableId: string, sort: Sort | undefined): void {
    this.save(this.getId(tableId, this.sortKey), sort);
  }

  loadSort(tableId: string): Sort | undefined {
    return this.load(this.getId(tableId, this.sortKey));
  }

  saveFilter(tableId: string, filter: string | DataTableFilterObject | undefined): void {
    this.save(this.getId(tableId, this.filterKey), filter);
  }

  loadFilter(tableId: string): DataTableFilterObject | undefined {
    return this.load(this.getId(tableId, this.filterKey));
  }

  savePageSize(tableId: string, pageSize: number | undefined): void {
    this.save(this.getId(tableId, this.pageSizeKey), pageSize);
  }

  loadPageSize(tableId: string): number | undefined {
    return this.load(this.getId(tableId, this.pageSizeKey));
  }

  protected save<T>(id: string, item: T | undefined): void {
    if (!!item) {
      localStorage.setItem(id, JSON.stringify(item));
    } else {
      localStorage.removeItem(id);
    }
  }

  protected load<T>(id: string): T | undefined {
    const item = localStorage.getItem(id);
    return !!item ? JSON.parse(item) : undefined;
  }

  protected getId(tableId: string, key: string): string {
    return `${tableId}.${key}`;
  }
}

export function DATA_TABLE_PERSISTENCE_SERVICE_PROVIDER_FACTORY(persistenceService: DataTablePersistenceService) {
  return persistenceService || new DataTablePersistenceService();
}

export const DATA_TABLE_PERSISTENCE_SERVICE_PROVIDER = {
  // If there is a custom DataTablePersistenceService available, use that. Otherwise, provide the "local storage" default one.
  provide: DataTablePersistenceService,
  deps: [[new Optional(), new SkipSelf(), DataTablePersistenceService]],
  useFactory: DATA_TABLE_PERSISTENCE_SERVICE_PROVIDER_FACTORY,
};
