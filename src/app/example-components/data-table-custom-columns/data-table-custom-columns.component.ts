import { Component } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { DataTableColumn } from '@porscheinformatik/material-addons';
import { users } from '../data-table-example-data/data-table-example-data';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table-custom-columns.component.html',
  styleUrls: ['./data-table-custom-columns.component.scss'],
})
export class DataTableCustomColumnsComponent {
  paginationEnabled = true;
  filterEnabled = true;
  displayedColumns: DataTableColumn[] = [
    {
      id: 'Title',
      label: 'Title',
      isSortable: true,
      orderByName: 'title',
      dataPropertyName: 'title',
      transformer: DataTableCustomColumnsComponent.translateTitle,
    },
    {
      id: 'Name',
      label: 'Name',
      isSortable: true,
      orderByName: 'name',
      dataPropertyName: 'name',
    },
    {
      id: 'Gender',
      label: 'Gender',
      orderByName: 'gender',
      dataPropertyName: 'gender',
      transformer: DataTableCustomColumnsComponent.genderSymbol,
    },
    {
      id: 'Age',
      label: 'Age',
      orderByName: 'age',
      dataPropertyName: 'age',
      isRightAligned: true,
      isSortable: true,
    },
    {
      id: 'Salary',
      label: 'Salary',
      orderByName: 'salary',
      dataPropertyName: 'salary',
      isRightAligned: true,
      isSortable: true,
    },
    {
      id: 'Email',
      label: 'Email',
      orderByName: 'email',
      dataPropertyName: 'email',
      transformer: DataTableCustomColumnsComponent.uppercase,
    },
    {
      id: 'regDate',
      label: 'Registration Date',
      orderByName: 'registered',
      dataPropertyName: 'registered',
      isRightAligned: true,
    },
  ];

  tableData: any[];

  constructor() {
    // generate random test data
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
  public static uppercase(value: string): string {
    return ('' + value).toUpperCase();
  }

  public static translateTitle(value: string): string {
    switch (value) {
      case 'Mr':
        return 'Herr';
      default:
        return 'Frau';
    }
  }

  public static genderSymbol(value: string): string {
    return value === 'male' ? '♂' : '♀';
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

  handleSortEvent(sort: Sort): void {
    // reset default sorting
    if (sort.direction === '') {
      sort.active = 'Name';
      sort.direction = 'asc';
    }
    const data = this.tableData.sort((a, b) => DataTableCustomColumnsComponent.compare(a, b, sort.active));
    this.tableData = [...(sort.direction === 'asc' ? data : data.reverse())];
  }
}
