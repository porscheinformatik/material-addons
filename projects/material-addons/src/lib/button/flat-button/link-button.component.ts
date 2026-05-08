import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MadBasicButton } from '../mad-basic-button';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'mad-link-button',
  templateUrl: './link-button.component.html',
  imports: [MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkButtonComponent extends MadBasicButton {}
