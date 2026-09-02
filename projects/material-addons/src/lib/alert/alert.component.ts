import { Component, computed, Inject, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AlertDefaultOptions, MAD_ALERT_DEFAULT_CONFIGURATION } from './alert-configuration';

export type AlertType = 'success' | 'info' | 'warning' | 'error';
export type AlertSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'mad-alert',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
})
export class AlertComponent {
  type = input<AlertType>(this.alertConfig.type);
  message = input<string>('');
  size = input<AlertSize>(this.alertConfig.size);
  actionText = input<string>('');
  closeable = input<boolean>(true);

  close = output<void>();
  action = output<void>();

  protected classes = computed(() => `${this.type()} ${this.size()}`);
  protected icon = computed(() => {
    switch (this.type()) {
      case 'success':
        return 'check_circle';
      case 'info':
        return 'info';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
    }
  });

  constructor(@Inject(MAD_ALERT_DEFAULT_CONFIGURATION) private alertConfig: AlertDefaultOptions) {}
}
