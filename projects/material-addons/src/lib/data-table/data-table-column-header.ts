export interface DataTableColumnHeader {
  label: string;
  dataPropertyName: string;
  isSortable?: boolean;
  isRightAligned?: boolean;
  transformer?: any;
  transformerParams?: any[];
}
