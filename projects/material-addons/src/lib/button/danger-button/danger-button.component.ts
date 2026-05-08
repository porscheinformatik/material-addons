import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MadBasicButton } from '../mad-basic-button';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'mad-danger-button',
  templateUrl: './danger-button.component.html',
  imports: [MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DangerButtonComponent extends MadBasicButton {}
