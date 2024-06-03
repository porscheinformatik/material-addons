import { Component } from '@angular/core';
import { TextFieldModule } from '@angular/cdk/text-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ButtonModule, ReadOnlyFormFieldModule, NumericFieldModule } from '@porscheinformatik/material-addons';

@Component({
  selector: 'app-read-only-field-wrapper',
  templateUrl: './read-only-field-wrapper.component.html',
  styleUrls: ['./read-only-field-wrapper.component.scss'],
  standalone: true,
  imports: [
    ButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatCheckboxModule,
    ReadOnlyFormFieldModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    TextFieldModule,
    NumericFieldModule,
  ],
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
