import { Component } from '@angular/core';
import { Example } from '../../components/example-viewer/example.class';
import { ThrottleClickComponent } from '../../example-components/throttle-click/throttle-click.component';

@Component({
  selector: 'app-throttle-click-demo',
  templateUrl: './throttle-click-demo.component.html',
  styleUrls: ['./throttle-click-demo.component.scss'],
})
export class ThrottleClickDemoComponent {
  throttleClickComponent = new Example(ThrottleClickComponent, 'throttle-click', 'Throttle Click - Directive');
}
