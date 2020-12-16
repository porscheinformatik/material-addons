import { Component, Input } from '@angular/core';

@Component({
  selector: 'mad-default-button',
  templateUrl: './default-button.component.html',
  styleUrls: ['./default-button.component.css'],
})
export class DefaultButtonComponent {
  @Input()
  type: string;

  @Input()
  disabled: boolean;

  @Input()
  title: string;
}
