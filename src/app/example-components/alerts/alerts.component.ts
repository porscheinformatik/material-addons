import { Component, ChangeDetectionStrategy } from '@angular/core';

import { AlertComponent } from '@porscheinformatik/material-addons';

@Component({
  selector: 'app-alerts',
  imports: [AlertComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './alerts.component.html',
})
export class AlertsComponent {
  onCloseAlert() {
    alert('Alert closed');
  }

  onActionAlert() {
    alert('Alert action');
  }
}
