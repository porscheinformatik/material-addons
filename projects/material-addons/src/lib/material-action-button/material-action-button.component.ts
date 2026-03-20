import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'mad-material-action-button',
  templateUrl: './material-action-button.component.html',
  styleUrls: ['./material-action-button.component.scss'],
  imports: [RouterLink, MatButtonModule, MatTooltipModule, MatIconModule],
})
export class MaterialActionButtonComponent {
  actionName = input<string>('');
  id = input<string>('');
  icon = input<string>('add');
  routerLink = input<string>('');
  liftHigher = input(true);
  liftHigher2 = input(false);
}
