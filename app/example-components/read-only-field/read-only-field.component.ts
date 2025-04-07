import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ReadOnlyFormFieldModule } from '@porscheinformatik/material-addons';

@Component({
  selector: 'app-read-only-caller',
  templateUrl: './read-only-field.component.html',
  styleUrls: ['./read-only-field.component.scss'],
  standalone: true,
  imports: [ReadOnlyFormFieldModule, DatePipe],
})
export class ReadOnlyFieldComponent {
  nullValue = null;
  undefinedValue: string;
  zeroValue = 0;
  demoText =
    'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore \n' +
    'et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. ';

  suffixClicked() {
    alert('suffix clicked');
  }

  prefixClicked() {
    alert('prefix clicked');
  }
}
