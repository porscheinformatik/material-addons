import { Component } from '@angular/core';
import { Example } from '../../components/example-viewer/example.class';
import { NumericFieldWrapperComponent } from '../../example-components/numeric-field-wrapper/numeric-field-wrapper.component';
import { ExampleViewerComponent } from '../../components/example-viewer/example-viewer.component';
import { TextCodeComponent } from '../../components/text-code/text-code.component';

@Component({
  selector: 'app-numeric-field-demo',
  templateUrl: './numeric-field-demo.component.html',
  styleUrls: ['./numeric-field-demo.component.scss'],
  standalone: true,
  imports: [TextCodeComponent, ExampleViewerComponent],
})
export class NumericFieldDemoComponent {
  numericFieldWrapperComponent = new Example(NumericFieldWrapperComponent, 'numeric-field-wrapper', 'Numeric form field wrapper');
}
