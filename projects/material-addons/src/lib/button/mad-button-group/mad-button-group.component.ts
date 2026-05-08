import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

@Component({
  selector: 'mad-button-group',
  template: '<ng-content></ng-content>',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MadButtonGroupComponent {
  @HostBinding('class.mad-button-group') setClass = true;
}
