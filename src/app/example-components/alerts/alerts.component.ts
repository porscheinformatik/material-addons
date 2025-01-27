import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '@porscheinformatik/material-addons';

@Component({
    selector: 'app-alerts',
    imports: [CommonModule, AlertComponent],
    templateUrl: './alerts.component.html'
})
export class AlertsComponent {
  onCloseAlert() {
    alert('Alert closed');
  }

  onActionAlert() {
    alert('Alert action');
  }
}
