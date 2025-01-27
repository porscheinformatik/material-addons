import { Component } from '@angular/core';
import { Example } from '../../components/example-viewer/example.class';
import { ActionButtonComponent } from '../../example-components/action-button/action-button.component';
import { RouterLink } from '@angular/router';
import { MaterialActionButtonModule } from '@porscheinformatik/material-addons';
import { ExampleViewerComponent } from '../../components/example-viewer/example-viewer.component';

@Component({
    selector: 'app-action-button-demo',
    templateUrl: './action-button-demo.component.html',
    styleUrls: ['./action-button-demo.component.scss'],
    imports: [ExampleViewerComponent, MaterialActionButtonModule, RouterLink]
})
export class ActionButtonDemoComponent {
  actionButtonComponent = new Example(ActionButtonComponent, 'action-button', 'Action button - Position is unset');
}
