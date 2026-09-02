import { Component } from '@angular/core';
import { Example } from '../../components/example-viewer/example.class';
import { StepperComponent } from '../../example-components/stepper/stepper.component';
import { ExampleViewerComponent } from '../../components/example-viewer/example-viewer.component';
import { TextCodeComponent } from '../../components/text-code/text-code.component';

@Component({
  selector: 'app-stepper-demo',
  templateUrl: './stepper-demo.component.html',
  styleUrls: ['./stepper-demo.component.scss'],
  imports: [TextCodeComponent, ExampleViewerComponent],
})
export class StepperDemoComponent {
  stepperComponent = new Example(StepperComponent, 'stepper', 'Stepper');
}
