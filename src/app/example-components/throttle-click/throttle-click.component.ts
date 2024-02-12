import { Component } from '@angular/core';

@Component({
  selector: 'app-throttle-click',
  templateUrl: './throttle-click.component.html',
  styleUrls: ['./throttle-click.component.scss'],
})
export class ThrottleClickComponent {
  counter = 0;
  counter2 = 0;

  onButtonClick(): void {
    this.counter = this.counter + 1;
  }

  onButtonClick2(): void {
    this.counter2 = this.counter2 + 1;
  }
}
