import { DataTableColumn } from './data-table-column';

export interface DataTableColumnDefinition {
  id: string;
  label: string;
  editable?: boolean;
  displayedColumnIds: string[];
}

export interface DataTableColumnDefinitionChange {
  action: string;
  definitionId: string;
  selectedColumns?: DataTableColumn[];
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
