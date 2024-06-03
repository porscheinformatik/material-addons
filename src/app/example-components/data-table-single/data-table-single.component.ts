import { Component } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { DataTableAction, DataTableColumn } from '@porscheinformatik/material-addons';
import { exampleData } from '../data-table-example-data/data-table-example-data';
import { exampleColumns } from '../data-table-example-data/data-table-example-columns';
import { DataTableComponent } from '@porscheinformatik/material-addons';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-data-table-single',
  templateUrl: './data-table-single.component.html',
  styleUrls: ['./data-table-single.component.scss'],
  standalone: true,
  imports: [MatCheckboxModule, DataTableComponent],
})
export class DataTableSingleComponent {
  paginationEnabled = true;
  filterEnabled = true;
  tableData = exampleData;

  displayedColumns: DataTableColumn[] = exampleColumns;

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

  handleActionEvent(rowAction: DataTableAction): void {
    // TODO simplify
    const action = rowAction.action;
    const selected = JSON.stringify(rowAction.selected);
    alert(`action = ${action} ... selected = ${selected}`);
  }

  handleSortEvent(sort: Sort): void {
    // reset default sorting
    if (sort.direction === '') {
      sort.active = 'Name';
      sort.direction = 'asc';
    }
    const data = this.tableData.sort((a, b) => DataTableSingleComponent.compare(a, b, sort.active));
    this.tableData = [...(sort.direction === 'asc' ? data : data.reverse())];
  }

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
}
