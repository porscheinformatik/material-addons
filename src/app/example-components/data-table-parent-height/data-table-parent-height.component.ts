import { Component } from '@angular/core';
import { exampleData } from '../data-table-example-data/data-table-example-data';
import { exampleColumns } from '../data-table-example-data/data-table-example-columns';

@Component({
  selector: 'app-data-table-parent-height',
  templateUrl: './data-table-parent-height.component.html',
  styleUrls: ['./data-table-parent-height.component.scss'],
})
export class DataTableParentHeightComponent {
  tableData = exampleData;
  displayedColumns = exampleColumns;
  largeContentArea = false;
  showContentAreaBorder = true;
}
