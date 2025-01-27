import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MadBasicButton } from '../mad-basic-button';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'mad-icon-button',
    templateUrl: './icon-button.component.html',
    imports: [MatButtonModule]
})
export class IconButtonComponent extends MadBasicButton {
  @Input()
  type: string;

  @Input()
  disabled: boolean;

  @Input()
  title = '';

  @ViewChild('btn', { read: ElementRef, static: true }) button: ElementRef;

  constructor() {
    super();
  }
}
