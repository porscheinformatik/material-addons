import {Component, Input} from '@angular/core';

@Component({
  selector: 'mad-link-button',
  templateUrl: './link-button.component.html',
  styleUrls: ['./link-button.component.css'],
})
export class LinkButtonComponent {
  @Input()
  type: string;

  @Input()
  disabled: boolean;

  @Input()
  title: string = '';

  @Input()
  clickEvent: Function;
}
