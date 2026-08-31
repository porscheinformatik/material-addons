import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ButtonModule } from '@porscheinformatik/material-addons';

@Component({
  selector: 'mad-button-groups',
  templateUrl: './mad-button-group.component.html',
  styleUrls: ['./mad-button-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, MatButtonModule],
})
export class MadButtonGroupComponent {}
