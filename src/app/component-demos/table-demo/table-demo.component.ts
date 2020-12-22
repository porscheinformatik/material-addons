import { Component } from '@angular/core';
import { Example } from '../../components/example-viewer/example.class';
import { TableComponent } from '../../example-components/table/table.component';

@Component({
  selector: 'app-table-demo',
  templateUrl: './table-demo.component.html',
  styleUrls: ['./table-demo.component.scss'],
})
export class TableDemoComponent {
  tableComponent = new Example(TableComponent, 'table', 'Table');
}
