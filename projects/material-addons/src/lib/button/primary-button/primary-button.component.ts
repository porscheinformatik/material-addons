import {Component, Input} from '@angular/core';

@Component({
  selector: 'mad-primary-button',
  templateUrl: './primary-button.component.html',
  styleUrls: ['./primary-button.component.css'],
})
export class PrimaryButtonComponent {
  @Input()
  type: string;

  @Input()
  disabled: boolean;

  @Input()
  title: string = '';
}
