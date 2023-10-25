import {Component} from '@angular/core';

@Component({
  selector: 'app-read-only-field-wrapper',
  templateUrl: './read-only-field-wrapper.component.html',
  styleUrls: ['./read-only-field-wrapper.component.scss'],
})
export class ReadOnlyFieldWrapperComponent {
  demoIdData = 'John Doe';
  demoIdNumber = 12345678;
  demoIdNumberHigh = 123456789012.99;
  textIsEditable = false;
  demoText =
    'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore \n' +
    'et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. ';
  shrinkDemoText =
    '1.)\tThis text is defined to have 4 rows\n' +
    '2.)\tdelete the text and it will shrink to one row\n' +
    '3.)\tit would also shrink,\n' +
    '4.)\tif value was undefined or null';

  suffixClicked() {
    alert('suffix clicked');
  }

  prefixedClicked() {
    alert('prefix clicked');
  }

  suffixEditOnlyClicked() {
    alert('suffix in edit only mode clicked');
  }

  suffixReadOnlyClicked() {
    alert('suffix in read only mode clicked');
  }
}
