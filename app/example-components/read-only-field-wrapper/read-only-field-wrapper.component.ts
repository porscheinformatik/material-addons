import { Component } from '@angular/core';

@Component({
  selector: 'app-read-only-field-wrapper',
  templateUrl: './read-only-field-wrapper.component.html',
  styleUrls: ['./read-only-field-wrapper.component.scss'],
})
export class ReadOnlyFieldWrapperComponent {
  demoIdData = 'John Doe';
  textIsEditable = false;
}
