import { Component } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { ColumnHeader, RowAction } from '@porscheinformatik/material-addons';

@Component({
  selector: 'app-action-table',
  templateUrl: './action-table.component.html',
  styleUrls: ['./action-table.component.scss'],
})
export class ActionTableComponent {
  paginationEnabled = true;
  filterEnabled = true;

  displayedColumns: ColumnHeader[] = [
    {
      name: 'Name',
      isSortable: true,
      dataPropertyName: 'name',
    },
    {
      name: 'Random',
      isSortable: true,
      dataPropertyName: 'random',
    },
    {
      name: 'Percentage',
      dataPropertyName: 'percentage',
      isRightAligned: true
    }
  ];

  rowActions: RowAction[] = [
    // first action defines the row action
    {
      name: 'Open'
    },
    {
      name: 'Edit'
    },
    {
      name: 'Delete'
    }
  ];

  displayedData: any[];

  constructor() {
    // generate random test data
    this.displayedData = [...Array(100).keys()]
      .map(number => ({
          name: `Name-${number}`,
          random: Math.random().toString(36).substring(2),
          percentage: Math.ceil(Math.random() * 100)
        }));
  }

  handleRowActionEvent(rowAction: RowAction): void {
    if (rowAction.name === 'Delete') {
      this.displayedData = this.displayedData.filter(row => row.name !== rowAction.outputRow.name);
    } else {
      alert(`${rowAction.name} ${rowAction.outputRow.name}`);
    }
  }

  handleSortEvent(sort: Sort): void {
    // reset default sorting
    if (sort.direction === '') {
      sort.active = 'Name';
      sort.direction = 'asc';
    }
    let data = this.displayedData
      .sort((a, b) => sort.active === 'Name' ? a.name.localeCompare(b.name)
        : sort.active === 'Random' ? a.random.localeCompare(b.random)
        : sort.active === 'Percentage' ? 0 : 0);
    this.displayedData = [...sort.direction === 'asc' ? data : data.reverse()];
  }
}
