import { Component } from '@angular/core';
import { DataTableAction } from '@porscheinformatik/material-addons';
import { CHILD_ROWS_EXAMPLE_DATA } from './child-rows-example-data';
import { CHILD_ROW_COLUMNS } from './child-rows-example-columns';
import { DataTableComponent } from 'material-addons';

@Component({
  selector: 'app-data-table-child-rows',
  templateUrl: './data-table-child-rows.component.html',
  styleUrls: ['./data-table-child-rows.component.scss'],
  standalone: true,
  imports: [DataTableComponent],
})
export class DataTableChildRowsComponent {
  paginationEnabled = false;
  filterEnabled = false;
  tableData = CHILD_ROWS_EXAMPLE_DATA;
  displayedColumns = CHILD_ROW_COLUMNS;

  actions: DataTableAction[] = [
    // first action defines the row action
    {
      label: 'Edit',
      action: 'EDIT',
      type: 'SINGLE',
    },
    {
      label: 'Delete',
      action: 'DELETE',
      type: 'SINGLE',
    },
    {
      label: 'Create',
      action: 'CREATE',
      type: 'NONE',
    },
  ];

  static compare(a: any, b: any, active: string): number {
    switch (active) {
      case 'Age':
        return a.age - b.age;
      case 'Salary':
        return a.salary - b.salary;
      default:
        return a.name.localeCompare(b.name);
    }
  }

  idGenerator(row: any): string {
    return row.id ? row.id : row.addressId;
  }

  parentIdGenerator(row: any): string {
    return row.userId ? row.userId : null;
  }

  handleActionEvent(rowAction: DataTableAction): void {
    const action = rowAction.action;
    const selected = JSON.stringify(rowAction.selected);
    alert(`action = ${action} ... selected = ${selected}`);
  }
}
