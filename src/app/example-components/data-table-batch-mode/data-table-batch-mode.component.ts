import { Component } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { DataTableAction, DataTableColumn } from '@porscheinformatik/material-addons';
import { users } from '../data-table-example-data/data-table-example-data';
import { columns } from '../data-table-example-data/data-table-example-columns';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table-batch-mode.component.html',
  styleUrls: ['./data-table-batch-mode.component.scss'],
})
export class DataTableBatchModeComponent {
  paginationEnabled = true;
  filterEnabled = false;
  batchMode = true;
  forceMode = 'BATCH';
  displayedColumns: DataTableColumn[] = columns;
  actions: DataTableAction[] = [
    // first action defines the row action
    {
      label: 'Create',
      action: 'CREATE',
      type: 'NONE',
    },
    {
      label: 'Edit',
      action: 'EDIT',
      type: 'SINGLE',
    },
    {
      label: 'Delete',
      action: 'DELETE',
      type: 'SINGLE',
      hiddenInMode: 'BATCH',
    },
    {
      label: 'Delete selected',
      action: 'DELETE',
      type: 'BATCH',
    },
    {
      label: 'Export selected',
      action: 'EXPORT',
      type: 'BATCH',
    },
    {
      label: 'Export all',
      action: 'EXPORT_ALL',
      type: 'NONE',
    },
    {
      label: 'Batch selection',
      action: 'BATCH',
      type: 'NONE',
    },
  ];
  tableData: any[];

  constructor() {
    // generate random test data
    this.tableData = users.results.map(user => ({
      title: user.name.title,
      name: user.name.first + ' ' + user.name.last,
      gender: user.gender,
      email: user.email,
      age: user.registered.age,
      salary: Math.abs(+user.location.coordinates.latitude),
      registered: user.registered.date,
    }));
  }

  public static compare(a: any, b: any, active: string): number {
    switch (active) {
      case 'Age':
        return a.age - b.age;
      case 'Salary':
        return a.salary - b.salary;
      default:
        return a.name.localeCompare(b.name);
    }
  }

  public static uppercase(value: string): string {
    return ('' + value).toUpperCase();
  }

  handleActionEvent(rowAction: DataTableAction): void {
    if (rowAction.action === 'BATCH') {
      this.toggleForceMode();
    } else {
      const selected = JSON.stringify(rowAction.selected);
      alert(`action = ${rowAction.action} ... selected = ${selected}`);
    }
  }

  handleSortEvent(sort: Sort): void {
    // reset default sorting
    if (sort.direction === '') {
      sort.active = 'Name';
      sort.direction = 'asc';
    }
    const data = this.tableData.sort((a, b) => DataTableBatchModeComponent.compare(a, b, sort.active));
    this.tableData = [...(sort.direction === 'asc' ? data : data.reverse())];
  }

  toggleForceMode() {
    this.batchMode = !this.batchMode;
    this.forceMode = this.batchMode ? 'BATCH' : 'SINGLE';
  }
}
