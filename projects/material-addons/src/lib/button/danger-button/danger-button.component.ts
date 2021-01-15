import {Component, Input} from '@angular/core';

@Component({
  selector: 'mad-danger-button',
  templateUrl: './danger-button.component.html',
  styleUrls: ['./danger-button.component.css'],
})
export class DangerButtonComponent {
  @Input()
  type: string;

  @Input()
  disabled: boolean;

  @Input()
  title: string = '';
}
