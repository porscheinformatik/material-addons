import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export type AlertType = 'success' | 'info' | 'warning' | 'error';
export type AlertSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'mad-alert',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
})
export class AlertComponent {
  @Input() type: AlertType = 'info';
  @Input() message: string = '';
  @Input() size: AlertSize = 'medium';
  @Input() actionText: string = '';
  @Input() closeable: boolean = true;
  @Output() close = new EventEmitter<void>();
  @Output() action = new EventEmitter<void>();

  get icon() {
    switch (this.type) {
      case 'success':
        return 'check_circle';
      case 'info':
        return 'info';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return '';
    }
  }

  closeAlert() {
    this.close.emit();
  }

  onAction() {
    this.action.emit();
  }
}
