export interface DataTableAction {
  label: string;
  action: string;
  type: "SINGLE" | "BATCH" | "NONE";
  selected?: any[];
  hiddenInMode?: string;
  groupId?: string | number;
  isHidden?: (data?: any[]) => boolean;
  isDisabled?: (data?: any[]) => boolean;
}
