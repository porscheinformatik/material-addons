import {Component, Input} from '@angular/core';

@Component({
  selector: 'mad-outline-button',
  templateUrl: './outline-button.component.html',
  styleUrls: ['./outline-button.component.css'],
})
export class OutlineButtonComponent {
  @Input()
  type: string;

  @Input()
  disabled: boolean;

  @Input()
  title: string = '';
}
