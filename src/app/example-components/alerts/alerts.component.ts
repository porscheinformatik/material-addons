import { Component } from '@angular/core';

import { AlertComponent } from '@porscheinformatik/material-addons';

@Component({
  selector: 'app-alerts',
  imports: [AlertComponent],
  templateUrl: './alerts.component.html',
})
export class AlertsComponent {
  onCloseAlert(): void {
    alert('Alert closed');
  }

  onActionAlert(): void {
    alert('Alert action');
  }
}
