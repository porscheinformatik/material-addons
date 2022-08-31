import { Component } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { DataTableAction, DataTableColumn } from '@porscheinformatik/material-addons';
import { users } from '../data-table-example-data/data-table-example-data';
import { columns } from '../data-table-example-data/data-table-example-columns';

@Component({
  selector: 'app-data-table-id-generator',
  templateUrl: './data-table-id-generator.component.html',
  styleUrls: ['./data-table-id-generator.component.scss'],
})
export class DataTableIdGeneratorComponent {
  paginationEnabled = true;
  filterEnabled = true;

  displayedColumns: DataTableColumn[] = columns;

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

  tableData: any[];

  constructor() {
    // generated random test data has not 'salary' field, so we use the absolute value of the longitude for demonstration purposes
    let idCounter = 0;
    this.tableData = users.results.map(user => ({
      id: idCounter++,
      title: user.name.title,
      name: user.name.first + ' ' + user.name.last,
      gender: user.gender,
      email: user.email,
      age: user.registered.age,
      salary: Math.abs(+user.location.coordinates.latitude),
      registered: user.registered.date,
    }));
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

  idGenerator(row: any): string {
    return '' + row.id;
  }

  handleActionEvent(rowAction: DataTableAction): void {
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
    const data = [...this.tableData].sort((a, b) => DataTableIdGeneratorComponent.compare(a, b, sort.active));
    this.tableData = [...(sort.direction === 'asc' ? data : [...data].reverse())];
  }
}
