import { Component } from '@angular/core';

import { TextCodeComponent } from '../../components/text-code/text-code.component';
import { ExampleViewerComponent } from '../../components/example-viewer/example-viewer.component';
import { Example } from '../../components/example-viewer/example.class';
import { AlertsComponent } from '../../example-components/alerts/alerts.component';
import { AlertDemoApiSpecComponent } from './alert-demo-api-spec/alert-demo-api-spec.component';

@Component({
  selector: 'app-alert-demo',
  imports: [TextCodeComponent, ExampleViewerComponent, AlertDemoApiSpecComponent],
  templateUrl: './alert-demo.component.html',
})
export class AlertDemoComponent {
  alertsComponent = new Example(AlertsComponent, 'alerts', 'Alerts');
}
