import { Component } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { ColumnHeader, TableAction } from '@porscheinformatik/material-addons';

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
      label: 'Name',
      isSortable: true,
      dataPropertyName: 'id',
    },
    {
      label: 'Random',
      isSortable: true,
      dataPropertyName: 'random',
    },
    {
      label: 'Percentage',
      dataPropertyName: 'percentage',
      isRightAligned: true,
    },
  ];

  rowActions: TableAction[] = [
    // first action defines the row action
    {
      label: 'Open',
      action: 'OPEN',
    },
    {
      label: 'Edit',
      action: 'EDIT',
    },
    {
      label: 'Delete',
      action: 'DELETE',
    },
  ];

  displayedData: any[];

  constructor() {
    // generate random test data
    this.displayedData = [...Array(100).keys()].map(num => ({
      id: `id-${num}`,
      random: Math.random()
        .toString(36)
        .substring(2),
      percentage: Math.ceil(Math.random() * 100),
    }));
  }

  handleRowActionEvent(rowAction: TableAction): void {
    if (rowAction.action === 'DELETE') {
      this.displayedData = this.displayedData.filter(row => row.id !== rowAction.outputRow.id);
    } else {
      alert(`${rowAction.action} ${rowAction.outputRow.id}`);
    }
  }

  handleSortEvent(sort: Sort): void {
    // reset default sorting
    if (sort.direction === '') {
      sort.active = 'Name';
      sort.direction = 'asc';
    }
    const data = this.displayedData.sort((a, b) =>
      sort.active === 'Name'
        ? a.name.localeCompare(b.name)
        : sort.active === 'Random'
        ? a.random.localeCompare(b.random)
        : sort.active === 'Percentage'
        ? 0
        : 0,
    );
    this.displayedData = [...(sort.direction === 'asc' ? data : data.reverse())];
  }
}
