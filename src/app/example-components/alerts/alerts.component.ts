import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from 'material-addons';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule, AlertComponent],
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.scss',
})
export class AlertsComponent {
  onCloseAlert() {
    alert('Alert closed');
  }

  onActionAlert() {
    alert('Alert action');
  }
}
