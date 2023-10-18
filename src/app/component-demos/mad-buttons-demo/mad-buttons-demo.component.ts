import { Component } from '@angular/core';
import { Example } from '../../components/example-viewer/example.class';
import { MadButtonsComponent } from '../../example-components/mad-buttons/mad-buttons.component';

@Component({
  selector: 'app-mad-buttons-demo',
  templateUrl: './mad-buttons-demo.component.html',
  styleUrls: ['./mad-buttons-demo.component.scss'],
})
export class MadButtonsDemoComponent {
  madButtonsComponent = new Example(MadButtonsComponent, 'mad-buttons', 'Material Addons Buttons');
}
