import { Directive, Input } from "@angular/core";
import { DataTableTemplateExpandableCellDefinition } from "./data-table-template-expandable-cell-definition.directive";

@Directive({
  /* eslint-disable @angular-eslint/directive-selector */
  selector: "[madExpandableColumnDef]",
})
/* eslint-disable @angular-eslint/directive-class-suffix */
export class DataTableTemplateExpandableColumnDefinition {
  @Input()
  madExpandableColumnDef: string;

  cellDef: DataTableTemplateExpandableCellDefinition | null;

  public register(cellDef: DataTableTemplateExpandableCellDefinition) {
    this.cellDef = cellDef;
  }

  public unregister() {
    this.cellDef = null;
  }
}
