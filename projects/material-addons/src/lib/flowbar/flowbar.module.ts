import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatStepperModule} from '@angular/material/stepper';
import {FlowbarComponent} from './flowbar.component';

@NgModule({
  declarations: [FlowbarComponent],
  imports: [CommonModule, MatStepperModule],
  exports: [FlowbarComponent],
})
export class FlowbarModule {}
