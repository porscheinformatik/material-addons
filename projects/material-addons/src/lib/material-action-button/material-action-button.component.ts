import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'mad-material-action-button',
  templateUrl: './material-action-button.component.html',
  styleUrls: ['./material-action-button.component.css'],
  imports: [RouterLink, MatButtonModule, MatTooltipModule, MatIconModule],
})
export class MaterialActionButtonComponent {
  @Input()
  actionName: string;

  @Input()
  id: string;

  @Input()
  icon = 'add';

  @Input()
  routerLink: string;

  // Sets the lower padding higher providing some bottom space for a fixed paginator
  @Input()
  liftHigher = true;

  @Input()
  liftHigher2 = false;
}
