import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MadBasicButton } from '../mad-basic-button';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'mad-link-button',
  templateUrl: './link-button.component.html',
  standalone: true,
  imports: [MatButtonModule],
})
export class LinkButtonComponent extends MadBasicButton {
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
