import { Component } from '@angular/core';
import { ReadOnlyFieldComponent } from '../../example-components/read-only-field/read-only-field.component';
import { Example } from '../../components/example-viewer/example.class';
import { ReadOnlyFieldWrapperComponent } from '../../example-components/read-only-field-wrapper/read-only-field-wrapper.component';
import { ReadOnlyFieldErrorComponent } from '../../example-components/read-only-field-error/read-only-field-error.component';

@Component({
  selector: 'app-read-only-demo',
  templateUrl: './read-only-demo.component.html',
  styleUrls: ['./read-only-demo.component.scss'],
})
export class ReadOnlyDemoComponent {
  readOnlyFormFieldComponent = new Example(ReadOnlyFieldComponent, 'read-only-field', 'Read only form field - unchangeable');
  readOnlyFormFieldErrorComponent = new Example(ReadOnlyFieldErrorComponent, 'read-only-field-error', 'Read only form field - error');
  readOnlyFormFieldWrapperComponent = new Example(
    ReadOnlyFieldWrapperComponent,
    'read-only-field-wrapper',
    'Read only form field wrapper - changeable',
  );
}
