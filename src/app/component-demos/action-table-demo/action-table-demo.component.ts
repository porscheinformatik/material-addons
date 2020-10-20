import { Component } from '@angular/core';
import { Example } from '../../components/example-viewer/example.class';
import { ActionTableComponent } from '../../example-components/action-table/action-table.component';

@Component({
  selector: 'app-action-table-demo',
  templateUrl: './action-table-demo.component.html',
  styleUrls: ['./action-table-demo.component.scss'],
})
export class ActionTableDemoComponent {
  actionTableComponent = new Example(ActionTableComponent, 'action-table', 'Action Table');
}
