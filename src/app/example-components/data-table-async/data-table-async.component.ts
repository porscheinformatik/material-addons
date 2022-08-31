import { Component } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { DataTableAction, DataTableColumn } from '@porscheinformatik/material-addons';
import { users } from '../data-table-example-data/data-table-example-data';
import { columns } from '../data-table-example-data/data-table-example-columns';

@Component({
  selector: 'app-data-table-async',
  templateUrl: './data-table-async.component.html',
  styleUrls: ['./data-table-async.component.scss'],
})
export class DataTableAsyncComponent {
  loading = false;
  filterEnabled = true;

  displayedColumns: DataTableColumn[] = columns;

  tableData: any[];

  constructor() {
    let idCounter = 0;
    this.tableData = users.results
      .map(user => ({
        id: idCounter++,
        title: user.name.title,
        name: user.name.first + ' ' + user.name.last,
        gender: user.gender,
        email: user.email,
        age: user.registered.age,
        salary: Math.abs(+user.location.coordinates.latitude),
        registered: user.registered.date,
      }))
      .slice(0, 10);
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

  handleActionEvent(rowAction: DataTableAction): void {
    const action = rowAction.action;
    alert(`action = ${action} ... selected = ${rowAction.selected}`);
  }

  handleSortEvent(sort: Sort): void {
    const sortString = JSON.stringify(sort);
    alert(sortString);
  }

  handlePagingEvent(event: any): void {
    const eventString = JSON.stringify(event);
    alert(eventString);
  }
}
