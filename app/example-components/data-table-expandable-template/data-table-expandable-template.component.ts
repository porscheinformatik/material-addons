import { Component } from '@angular/core';
import { exampleData } from '../data-table-example-data/data-table-example-data';
import { idColumns } from '../data-table-example-data/data-table-example-columns';

@Component({
  selector: 'app-data-table-expandable-template',
  templateUrl: './data-table-expandable-template.component.html',
  styleUrls: ['./data-table-expandable-template.component.scss'],
})
export class DataTableExpandableTemplateComponent {
  paginationEnabled = true;
  filterEnabled = true;
  tableData = exampleData.map((it) => ({ ...it, additionalData: [1, 2, 3, 4, 5].map((num) => `${it.name}-${num}`) }));
  displayedColumns = idColumns;

  readonly JSON = JSON;
}
