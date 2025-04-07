import { Component } from '@angular/core';
import { exampleData } from '../data-table-example-data/data-table-example-data';
import { filterColumns } from '../data-table-example-data/data-table-example-columns';
import { DataTableComponent } from '@porscheinformatik/material-addons';

@Component({
  selector: 'app-data-table-column-filter',
  templateUrl: './data-table-column-filter.component.html',
  styleUrls: ['./data-table-column-filter.component.scss'],
  standalone: true,
  imports: [DataTableComponent],
})
export class DataTableColumnFilterComponent {
  paginationEnabled = true;
  filterEnabled = true;
  tableData = exampleData;
  displayedColumns = filterColumns;
}
