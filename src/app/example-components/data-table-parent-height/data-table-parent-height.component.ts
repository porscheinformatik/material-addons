import { Component } from '@angular/core';
import { exampleData } from '../data-table-example-data/data-table-example-data';
import { exampleColumns } from '../data-table-example-data/data-table-example-columns';
import { DataTableComponent } from '@porscheinformatik/material-addons';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-data-table-parent-height',
  templateUrl: './data-table-parent-height.component.html',
  styleUrls: ['./data-table-parent-height.component.scss'],
  standalone: true,
  imports: [NgClass, MatCheckboxModule, DataTableComponent],
})
export class DataTableParentHeightComponent {
  tableData = exampleData;
  displayedColumns = exampleColumns;
  largeContentArea = false;
  showContentAreaBorder = true;
}
