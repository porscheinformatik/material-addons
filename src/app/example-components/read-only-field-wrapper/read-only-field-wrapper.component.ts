import {Component} from '@angular/core';

@Component({
  selector: 'app-read-only-field-wrapper',
  templateUrl: './read-only-field-wrapper.component.html',
  styleUrls: ['./read-only-field-wrapper.component.scss'],
})
export class ReadOnlyFieldWrapperComponent {
  demoIdData = 'John Doe';
  demoIdNumber = 12345678;
  textIsEditable = false;
  demoText =
    'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore \n' +
    'et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. ';
}
