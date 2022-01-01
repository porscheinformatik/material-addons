import { Component } from '@angular/core';
import { Example } from '../../components/example-viewer/example.class';
import { StepperComponent } from '../../example-components/stepper/stepper.component';

@Component({
  selector: 'app-stepper-demo',
  templateUrl: './stepper-demo.component.html',
  styleUrls: ['./stepper-demo.component.scss'],
})
export class StepperDemoComponent {
  stepperComponent = new Example(StepperComponent, 'stepper', 'Stepper');
}
