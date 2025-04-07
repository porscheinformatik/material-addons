import { Component } from '@angular/core';
import { exampleData } from '../data-table-example-data/data-table-example-data';
import { idColumns } from '../data-table-example-data/data-table-example-columns';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { DataTableComponent, DataTableTemplateColumnDefinition, DataTableTemplateCellDefinition } from '@porscheinformatik/material-addons';

@Component({
  selector: 'app-data-table-cell-templates',
  templateUrl: './data-table-cell-templates.component.html',
  styleUrls: ['./data-table-cell-templates.component.scss'],
  standalone: true,
  imports: [DataTableComponent, DataTableTemplateColumnDefinition, DataTableTemplateCellDefinition, NgIf, MatIconModule],
})
export class DataTableCellTemplatesComponent {
  paginationEnabled = true;
  filterEnabled = true;
  tableData = exampleData;
  displayedColumns = idColumns;
}
