import { NgModule } from '@angular/core';
import { ThrottleClickDirective } from './throttle-click.directive';

@NgModule({
  imports: [ThrottleClickDirective],
  exports: [ThrottleClickDirective],
})
export class ThrottleClickModule {}
