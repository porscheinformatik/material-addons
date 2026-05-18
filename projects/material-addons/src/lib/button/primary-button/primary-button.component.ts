import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MadBasicButton } from '../mad-basic-button';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'mad-primary-button',
  templateUrl: './primary-button.component.html',
  imports: [MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimaryButtonComponent extends MadBasicButton {}
