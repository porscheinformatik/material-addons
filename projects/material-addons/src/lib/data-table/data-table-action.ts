export interface DataTableAction {
  label: string;
  action: string;
  type: "SINGLE" | "BATCH" | "NONE";
  selected?: any[];
  hiddenInMode?: string;
}
