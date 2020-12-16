import { Component, Input } from '@angular/core';

@Component({
  selector: 'mad-secondary-button',
  templateUrl: './secondary-button.component.html',
  styleUrls: ['./secondary-button.component.css'],
})
export class SecondaryButtonComponent {
  @Input()
  type: string;

  @Input()
  disabled: boolean;

  @Input()
  title: string;
}
