import { Component } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { ColumnHeader, TableAction, TableModule } from '@porscheinformatik/material-addons';
import { users } from './data';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  imports: [MatCheckboxModule, TableModule],
})
export class TableComponent {
  paginationEnabled = true;
  filterEnabled = true;

  displayedColumns: ColumnHeader[] = [
    {
      label: 'Name',
      isSticky: true,
      isSortable: true,
      dataPropertyName: 'name',
    },
    {
      label: 'Gender',
      dataPropertyName: 'gender',
    },
    {
      label: 'Email',
      isSortable: true,
      dataPropertyName: 'email',
    },
    {
      label: 'Registration Date',
      dataPropertyName: 'registered',
      isRightAligned: true,
    },
  ];

  rowActions: TableAction[] = [
    // first action defines the row action
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
    this.displayedData = users.results.map((user) => ({
      name: `${user.name.title}. ${user.name.first} ${user.name.last}`,
      gender: user.gender,
      email: user.email,
      registered: new Date(user.registered.date).toDateString(),
    }));
  }

  handleRowActionEvent(rowAction: TableAction): void {
    if (rowAction.action === 'DELETE') {
      this.displayedData = this.displayedData.filter((row) => row.id !== rowAction.outputRow.id);
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
