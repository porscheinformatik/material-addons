export interface DataTableColumn {
  id: string;
  label: string;
  orderByName: string;
  dataPropertyName: string;
  isSortable?: boolean;
  isRightAligned?: boolean;
  transformer?: any;
  transformerParams?: any[];
}
