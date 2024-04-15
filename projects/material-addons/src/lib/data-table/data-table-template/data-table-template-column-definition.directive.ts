import { Directive, Input } from '@angular/core';
import { DataTableTemplateCellDefinition } from './data-table-template-cell-definition.directive';

@Directive({
  selector: '[madColumnDef]',
  standalone: true,
})
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
