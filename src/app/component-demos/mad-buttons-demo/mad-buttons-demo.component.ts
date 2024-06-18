import { Component } from '@angular/core';
import { Example } from '../../components/example-viewer/example.class';
import { MadButtonsComponent } from '../../example-components/mad-buttons/mad-buttons.component';
import { MadButtonGroupComponent } from '../../example-components/mad-button-group/mad-button-group.component';
import { ExampleViewerComponent } from '../../components/example-viewer/example-viewer.component';
import { TextCodeComponent } from '../../components/text-code/text-code.component';

@Component({
  selector: 'app-mad-buttons-demo',
  templateUrl: './mad-buttons-demo.component.html',
  styleUrls: ['./mad-buttons-demo.component.scss'],
  standalone: true,
  imports: [TextCodeComponent, ExampleViewerComponent],
})
export class MadButtonsDemoComponent {
  madButtonsComponent = new Example(MadButtonsComponent, 'mad-buttons', 'Material Addons Buttons');
  madButtonGroupComponent = new Example(MadButtonGroupComponent, 'mad-button-group', 'Material Button Group');
}
