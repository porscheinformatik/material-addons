import { Component } from '@angular/core';
import { exampleColumns } from '../data-table-example-data/data-table-example-columns';
import { exampleData } from '../data-table-example-data/data-table-example-data';
import {
  DataTableColumnDefinitionChange,
  DataTableColumn,
  DataTableColumnDefinition,
  DataTableComponent,
} from '@porscheinformatik/material-addons';

@Component({
  selector: 'app-data-table-column-configuration',
  templateUrl: './data-table-column-configuration.component.html',
  styleUrls: ['./data-table-column-configuration.component.scss'],
  imports: [DataTableComponent],
})
export class DataTableColumnConfigurationComponent {
  tableData = exampleData;
  allColumns: DataTableColumn[];
  columnDefinitions: DataTableColumnDefinition[] = [
    {
      id: '12345678-default',
      label: 'Default',
      displayedColumns: exampleColumns,
    },
    {
      id: '87654321-company',
      label: 'Settings 1',
      editable: true,
      displayedColumns: [
        {
          id: '0002-Name',
          label: 'Name',
          isSortable: true,
          orderByName: 'name',
          dataPropertyName: 'name',
        },
        {
          id: '0005-Salary',
          label: 'Salary',
          orderByName: 'salary',
          dataPropertyName: 'salary',
          isRightAligned: true,
          isSortable: true,
        },
        {
          id: '0003-Gender',
          label: 'Gender',
          orderByName: 'gender',
          dataPropertyName: 'gender',
        },
        {
          id: '0001-Title',
          label: 'Title',
          isSortable: true,
          orderByName: 'title',
          dataPropertyName: 'title',
        },
      ],
    },
    {
      id: 'user-123',
      label: 'Other settings',
      editable: true,
      displayedColumns: [
        {
          id: '0006-Email',
          label: 'Email',
          orderByName: 'email',
          dataPropertyName: 'email',
        },
        {
          id: '0002-Name',
          label: 'Name',
          isSortable: true,
          orderByName: 'name',
          dataPropertyName: 'name',
        },
      ],
    },
  ];
  displayedDefinition = this.columnDefinitions[0];

  handleAllColumnsEvent(): void {
    this.allColumns = exampleColumns;
  }

  handleViewDefinitionChangeEvent(definition: DataTableColumnDefinition): void {
    this.displayedDefinition = definition;
  }

  handleColumnDefinitionChangeEvent(change: DataTableColumnDefinitionChange): void {
    alert(JSON.stringify(change));
    if (change?.action === 'SAVE') {
      // no actual 'SAVING' here, just switching the current columns for demo purposes
      this.displayedDefinition = change.definition;
    }
  }
}
