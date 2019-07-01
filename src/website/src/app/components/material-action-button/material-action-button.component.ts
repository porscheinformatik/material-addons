import {Component, Input} from '@angular/core';

@Component({
  selector: 'material-action-button',
  templateUrl: './material-action-button.component.html',
  styleUrls: ['./material-action-button.component.scss']
})
export class MaterialActionButtonComponent {

  @Input()
  actionName: string;

  @Input()
  id: string;

  @Input()
  icon: string = 'add';

  @Input()
  routerLink: string;

  // Sets the lower padding higher providing some bottom space for a fixed paginator
  @Input()
  liftHigher = true;

  @Input()
  liftHigher2 = false;

  constructor() {
  }

}
