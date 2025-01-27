import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MadBasicButton } from '../mad-basic-button';
import { ThemePalette } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'mad-outline-button',
    templateUrl: './outline-button.component.html',
    styleUrls: ['./outline-button.component.scss'],
    imports: [MatButtonModule]
})
export class OutlineButtonComponent extends MadBasicButton {
  @Input()
  type: string;

  @Input()
  disabled: boolean;

  @Input()
  title = '';

  @Input()
  color: ThemePalette = 'primary';

  @ViewChild('btn', { read: ElementRef, static: true }) button: ElementRef;

  constructor() {
    super();
  }
}
