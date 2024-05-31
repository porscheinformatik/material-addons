import { Component } from '@angular/core';
import { exampleData } from '../data-table-example-data/data-table-example-data';
import { filterColumns } from '../data-table-example-data/data-table-example-columns';
import { DataTablePersistenceConfiguration } from 'projects/material-addons/src/public_api';
import { DataTableComponent } from 'material-addons';

@Component({
  selector: 'app-data-table-stateful',
  templateUrl: './data-table-stateful.component.html',
  styleUrls: ['./data-table-stateful.component.scss'],
  standalone: true,
  imports: [DataTableComponent],
})
export class DataTableStatefulComponent {
  id = 'my.stateful.table';
  paginationEnabled = true;
  filterEnabled = true;
  tableData = exampleData;
  displayedColumns = filterColumns;
  persistenceConfig: DataTablePersistenceConfiguration = {
    persistSort: true,
    persistFilter: true,
    persistPageSize: true,
  };

  readonly JSON = JSON;

  public get sortState() {
    return this.getState('sort');
  }

  public get filterState() {
    return this.getState('filter');
  }

  public get pageSizeState() {
    return this.getState('pageSize');
  }

  private getState(property: string) {
    return localStorage.getItem(`${this.id}.${property}`);
  }
}
