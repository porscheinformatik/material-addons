import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MadBasicButton } from '../mad-basic-button';
import { ThemePalette } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'mad-outline-button',
  templateUrl: './outline-button.component.html',
  styleUrls: ['./outline-button.component.scss'],
  imports: [MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OutlineButtonComponent extends MadBasicButton {
  readonly color = input<ThemePalette>('primary');
}
