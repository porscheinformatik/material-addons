import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThrottleClickDirective } from './throttle-click.directive';

@NgModule({
  declarations: [ThrottleClickDirective],
  imports: [CommonModule],
  exports: [ThrottleClickDirective],
})
export class ThrottleClickModule {}
