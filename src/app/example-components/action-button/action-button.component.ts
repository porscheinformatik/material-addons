import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialActionButtonModule } from '@porscheinformatik/material-addons';

@Component({
  selector: 'app-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialActionButtonModule, RouterLink],
})
export class ActionButtonComponent {}
