import { Directive, Input } from '@angular/core';
import { DataTableTemplateExpandableCellDefinition } from './data-table-template-expandable-cell-definition.directive';

@Directive({
  selector: '[madExpandableColumnDef]',
  standalone: true,
})
export class DataTableTemplateExpandableColumnDefinition {
  @Input()
  madExpandableColumnDef: string;

  cellDef: DataTableTemplateExpandableCellDefinition | null;

  register(cellDef: DataTableTemplateExpandableCellDefinition) {
    this.cellDef = cellDef;
  }

  unregister() {
    this.cellDef = null;
  }
}
