import { Component } from '@angular/core';
import { Example } from '../../components/example-viewer/example.class';
import { NumericFieldWrapperComponent } from 'src/app/example-components/numeric-field-wrapper/numeric-field-wrapper.component';

@Component({
  selector: 'app-numeric-field-demo',
  templateUrl: './numeric-field-demo.component.html',
  styleUrls: ['./numeric-field-demo.component.scss'],
})
export class NumericFieldDemoComponent {
  numericFieldWrapperComponent = new Example(
    NumericFieldWrapperComponent,
    'numeric-field-wrapper',
    'Numeric form field wrapper',
  );
}
