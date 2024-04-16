import { Component } from '@angular/core';
import { exampleData } from '../data-table-example-data/data-table-example-data';
import { idColumns } from '../data-table-example-data/data-table-example-columns';

@Component({
  selector: 'app-data-table-cell-templates',
  templateUrl: './data-table-cell-templates.component.html',
  styleUrls: ['./data-table-cell-templates.component.scss'],
})
export class DataTableCellTemplatesComponent {
  paginationEnabled = true;
  filterEnabled = true;
  tableData = exampleData;
  displayedColumns = idColumns;
}
