import { Component } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { DataTableAction, DataTableColumn, DataTableColumnDefinition } from '@porscheinformatik/material-addons';
import { users } from '../data-table-example-data/data-table-example-data';
import { columns } from '../data-table-example-data/data-table-example-columns';
import { DataTableColumnDefinitionChange } from '../../../../projects/material-addons/src/lib/data-table/data-table-column-definition';

@Component({
  selector: 'app-data-table-column-configuration',
  templateUrl: './data-table-column-configuration.component.html',
  styleUrls: ['./data-table-column-configuration.component.scss'],
})
export class DataTableColumnConfigurationComponent {
  paginationEnabled = true;
  filterEnabled = true;

  displayedColumns: DataTableColumn[] = columns;
  allColumns: DataTableColumn[];
  columnDefinitions: DataTableColumnDefinition[] = [
    {
      id: '12345678-default',
      label: 'Default',
      displayedColumnIds: ['0001-Title', '0002-Name', '0003-Gender', '0004-Age', '0005-Salary', '0006-Email', '0007-RegDate'],
    },
    {
      id: '87654321-company',
      label: 'Company settings',
      editable: true,
      displayedColumnIds: ['0002-Name', '0005-Salary', '0003-Gender', '0001-Title'],
    },
    {
      id: 'user-123',
      label: 'User settings',
      editable: true,
      displayedColumnIds: ['0002-Name', '0001-Title'],
    },
  ];

  tableData: any[];

  constructor() {
    // generated random test data has not 'salary' field so we use the absolute value of the longitude for demonstration purposes
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

  handleActionEvent(rowAction: DataTableAction): void {
    const action = rowAction.action;
    alert(`action = ${action} ... selected = ${rowAction.selected}`);
  }

  handleSortEvent(sort: Sort): void {
    // reset default sorting
    if (sort.direction === '') {
      sort.active = 'Name';
      sort.direction = 'asc';
    }
    const data = [...this.tableData].sort((a, b) => DataTableColumnConfigurationComponent.compare(a, b, sort.active));
    this.tableData = [...(sort.direction === 'asc' ? data : [...data].reverse())];
  }

  handleAllColumnsEvent(): void {
    this.allColumns = columns;
  }

  handleViewDefinitionChangeEvent(definition: DataTableColumnDefinition): void {
    const newColumns: DataTableColumn[] = [];
    for (const columnId of definition.displayedColumnIds) {
      const found = columns.find(d => d.id === columnId);
      if (found) {
        newColumns.push(found);
      }
    }
    this.displayedColumns = [...newColumns];
  }

  handleColumnDefinitionChangeEvent(change: DataTableColumnDefinitionChange): void {
    alert(JSON.stringify(change));
    if (change?.action === 'SAVE') {
      // no actual 'SAVING' here, just switching the current columns for demo purposes
      this.displayedColumns = [...change.selectedColumns];
    }
  }
}
