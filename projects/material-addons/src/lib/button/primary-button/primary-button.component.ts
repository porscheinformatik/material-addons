import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {MadBasicButton} from '../mad-basic-button';

@Component({
  selector: 'mad-primary-button',
  templateUrl: './primary-button.component.html',
  styleUrls: ['./primary-button.component.css'],
})
export class PrimaryButtonComponent extends MadBasicButton {
  @Input()
  type: string;

  @Input()
  disabled: boolean;

  @Input()
  title: string = '';

  @ViewChild('btn', { read: ElementRef, static: true }) button: ElementRef;

  constructor() {
    super();
    super.button = this.button;
    super.disabled = this.disabled;
  }
}
