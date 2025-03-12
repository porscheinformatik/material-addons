import { Component } from '@angular/core';
import { Example } from '../../components/example-viewer/example.class';
import { ThrottleClickComponent } from '../../example-components/throttle-click/throttle-click.component';
import { ExampleViewerComponent } from '../../components/example-viewer/example-viewer.component';
import { TextCodeComponent } from '../../components/text-code/text-code.component';

@Component({
  selector: 'app-throttle-click-demo',
  templateUrl: './throttle-click-demo.component.html',
  styleUrls: ['./throttle-click-demo.component.scss'],
  imports: [TextCodeComponent, ExampleViewerComponent],
})
export class ThrottleClickDemoComponent {
  throttleClickComponent = new Example(ThrottleClickComponent, 'throttle-click', 'Throttle Click - Directive');
}
