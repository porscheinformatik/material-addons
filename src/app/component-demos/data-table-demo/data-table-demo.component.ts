import { Component } from "@angular/core";
import { Example } from "../../components/example-viewer/example.class";
import { DataTableComponent } from "../../example-components/data-table/data-table.component";

@Component({
  selector: 'app-data-table-demo',
  templateUrl: './data-table-demo.component.html',
  styleUrls: ['./data-table-demo.component.scss'],
})
export class DataTableDemoComponent {
  dataTableComponent = new Example(DataTableComponent, 'table', 'Table');
}
