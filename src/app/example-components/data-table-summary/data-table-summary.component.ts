import { Component } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { DataTableAction, DataTableComponent } from '@porscheinformatik/material-addons';
import { summaryData } from '../data-table-example-data/data-table-example-data';
import { summaryColumns } from '../data-table-example-data/data-table-example-columns';

@Component({
  selector: 'app-data-table-summary',
  templateUrl: './data-table-summary.component.html',
  styleUrls: ['./data-table-summary.component.scss'],
  imports: [DataTableComponent],
})
export class DataTableSummaryComponent {
  tableData = summaryData;
  displayedColumns = summaryColumns;

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
    const data = this.tableData.sort((a, b) => DataTableSummaryComponent.compare(a, b, sort.active));
    this.tableData = [...(sort.direction === 'asc' ? data : data.reverse())];
  }
}
