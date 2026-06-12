import { PageEvent } from '@angular/material/paginator';
import { DataTablePersistenceConfiguration } from './configuration/data-table-persistence-configuration';
import { DataTableSelectionMode } from './configuration/data-table-selection-mode';

export const DEFAULT_PAGE: PageEvent = { pageIndex: 0, pageSize: 50, length: 0 };

export const DEFAULT_PERSISTENCE_CONFIG: DataTablePersistenceConfiguration = {
  persistSort: false,
  persistFilter: false,
  persistPageSize: false,
};

export function arrayOrEmpty<T>(value: T[] | null | undefined): T[] {
  return value ?? [];
}

export function pageOrDefault(value: PageEvent | null | undefined): PageEvent {
  return value ?? DEFAULT_PAGE;
}

export function persistenceConfigOrUndefined(
  value: DataTablePersistenceConfiguration | null | undefined,
): DataTablePersistenceConfiguration | undefined {
  return value ?? undefined;
}

export function isDeprecatedForceSelectionMode(value: string | undefined): value is DataTableSelectionMode {
  return value === 'SINGLE' || value === 'BATCH';
}
