import { StepComponent, StepperComponent } from './stepper.component';
import { StepHeaderComponent } from './step-header/step-header.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { ButtonModule } from '../button/button.module';

@NgModule({
  declarations: [StepperComponent, StepHeaderComponent, StepComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule, CdkStepperModule, ButtonModule],
  exports: [StepperComponent, StepHeaderComponent, StepComponent],
})
export class StepperModule {}
