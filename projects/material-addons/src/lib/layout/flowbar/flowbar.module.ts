import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { FlowbarComponent } from './flowbar.component';

@NgModule({
  imports: [CommonModule, MatStepperModule, FlowbarComponent],
  exports: [FlowbarComponent],
})
export class FlowbarModule {}
