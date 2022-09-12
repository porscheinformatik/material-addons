import { Component } from '@angular/core';
import { exampleData } from '../data-table-example-data/data-table-example-data';
import { exampleColumns } from '../data-table-example-data/data-table-example-columns';

@Component({
  selector: 'app-data-table-basic',
  templateUrl: './data-table-basic.component.html',
  styleUrls: ['./data-table-basic.component.scss'],
})
export class DataTableBasicComponent {
  paginationEnabled = true;
  filterEnabled = true;
  tableData = exampleData;
  displayedColumns = exampleColumns;
}
