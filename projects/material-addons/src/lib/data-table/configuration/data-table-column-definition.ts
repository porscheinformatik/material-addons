import { DataTableColumn } from './data-table-column';

export interface DataTableColumnDefinition {
  id: string;
  label: string;
  editable?: boolean;
  infotext?: string;
  displayedColumns: DataTableColumn[];
}

export interface DataTableColumnDefinitionChange {
  action: string;
  definition: DataTableColumnDefinition;
}

export interface DataTableDialogData {
  allColumns: DataTableColumn[];
  definition: DataTableColumnDefinition;
  deleteDefinitionAllowed: boolean;
  filterColumnsLabel: string;
  filterColumnsPlaceHolder: string;
  noDataText: string;
  titleLabel: string;
  selectedLabel: string;
  availableLabel: string;
  saveLabel: string;
  deleteLabel: string;
  cancelLabel: string;
  infoTextLabel: string;
}
