import { Directive, Input } from "@angular/core";
import { DataTableTemplateCellDefinition } from "./data-table-template-cell-definition.directive";

@Directive({
  /* eslint-disable @angular-eslint/directive-selector */
  selector: "[madColumnDef]",
})
/* eslint-disable @angular-eslint/directive-class-suffix */
export class DataTableTemplateColumnDefinition {
  @Input()
  madColumnDef: string;

  cellDef: DataTableTemplateCellDefinition | null;

  public register(cellDef: DataTableTemplateCellDefinition) {
    this.cellDef = cellDef;
  }

  public unregister() {
    this.cellDef = null;
  }
}
