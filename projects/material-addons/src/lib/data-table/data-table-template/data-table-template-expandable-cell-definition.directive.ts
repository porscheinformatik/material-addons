import { Directive, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { DataTableTemplateExpandableColumnDefinition } from './data-table-template-expandable-column-definition.directive';

@Directive({
  selector: '[madExpandableCellDef]',
  standalone: true,
})
export class DataTableTemplateExpandableCellDefinition implements OnInit, OnDestroy {
  constructor(
    private templateRef: TemplateRef<any>,
    public columnDef: DataTableTemplateExpandableColumnDefinition,
  ) {}

  ngOnInit(): void {
    this.columnDef.register(this);
  }

  ngOnDestroy(): void {
    this.columnDef.unregister();
  }

  getCellTemplate(): TemplateRef<any> {
    return this.templateRef;
  }
}
