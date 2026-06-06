import { Directive, input } from '@angular/core';
import { DataTableTemplateExpandableCellDefinition } from './data-table-template-expandable-cell-definition.directive';

@Directive({
  selector: '[madExpandableColumnDef]',
  standalone: true,
})
export class DataTableTemplateExpandableColumnDefinition {
  readonly madExpandableColumnDef = input.required<string>();

  cellDef: DataTableTemplateExpandableCellDefinition | null;

  register(cellDef: DataTableTemplateExpandableCellDefinition) {
    this.cellDef = cellDef;
  }

  unregister() {
    this.cellDef = null;
  }
}
