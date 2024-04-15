import { DataTableFilterOption } from '../data-table-filter/data-table-filter-options';

export interface DataTableColumn {
  id: string;
  label: string;
  orderByName?: string;
  dataPropertyName: string;
  isSortable?: boolean;
  isRightAligned?: boolean;
  transformer?: any;
  transformerParams?: any[];
  isFilterable?: boolean;
  filterParams?: {
    filterOptions: DataTableFilterOption[];
  };
}
