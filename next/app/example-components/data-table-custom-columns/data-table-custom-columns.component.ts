import { Component } from '@angular/core';
import { DataTableColumn, DataTableComponent } from '@porscheinformatik/material-addons';
import { exampleData } from '../data-table-example-data/data-table-example-data';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table-custom-columns.component.html',
  styleUrls: ['./data-table-custom-columns.component.scss'],
  imports: [DataTableComponent],
})
export class DataTableCustomColumnsComponent {
  tableData = exampleData;

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
}
