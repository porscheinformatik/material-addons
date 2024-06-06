import { Component } from '@angular/core';
import { Example } from '../../components/example-viewer/example.class';
import { TableComponent } from '../../example-components/table/table.component';
import { ExampleViewerComponent } from '../../components/example-viewer/example-viewer.component';
import { TextCodeComponent } from '../../components/text-code/text-code.component';

@Component({
  selector: 'app-table-demo',
  templateUrl: './table-demo.component.html',
  styleUrls: ['./table-demo.component.scss'],
  standalone: true,
  imports: [TextCodeComponent, ExampleViewerComponent],
})
export class TableDemoComponent {
  tableComponent = new Example(TableComponent, 'table', 'Table');
}
