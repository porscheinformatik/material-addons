import { Directive, input } from '@angular/core';
import { DataTableTemplateCellDefinition } from './data-table-template-cell-definition.directive';

@Directive({
  selector: '[madColumnDef]',
  standalone: true,
})
export class DataTableTemplateColumnDefinition {
  readonly madColumnDef = input.required<string>();

  cellDef: DataTableTemplateCellDefinition | null;

  public register(cellDef: DataTableTemplateCellDefinition) {
    this.cellDef = cellDef;
  }

  public unregister() {
    this.cellDef = null;
  }
}
