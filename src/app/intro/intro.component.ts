import {Component} from '@angular/core';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
})
export class IntroComponent {

  public currentYear(): number {
    return new Date().getFullYear();
  }

}
