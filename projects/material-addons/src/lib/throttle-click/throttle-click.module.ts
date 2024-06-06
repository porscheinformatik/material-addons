import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThrottleClickDirective } from './throttle-click.directive';

@NgModule({
  imports: [CommonModule, ThrottleClickDirective],
  exports: [ThrottleClickDirective],
})
export class ThrottleClickModule {}
