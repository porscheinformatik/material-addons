import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MadBasicButton } from '../mad-basic-button';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'mad-danger-button',
  templateUrl: './danger-button.component.html',
  styleUrls: ['./danger-button.component.css'],
  imports: [MatButtonModule],
})
export class DangerButtonComponent extends MadBasicButton {
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
