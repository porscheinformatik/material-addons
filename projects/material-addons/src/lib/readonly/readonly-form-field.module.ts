import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReadOnlyFormFieldWrapperComponent } from './readonly-form-field-wrapper/readonly-form-field-wrapper.component';
import { ReadOnlyFormFieldComponent } from './readonly-form-field/readonly-form-field.component';
import { MatFormFieldModule, MatInputModule } from '@angular/material';

@NgModule({
  declarations: [ReadOnlyFormFieldComponent, ReadOnlyFormFieldWrapperComponent],
  imports: [CommonModule, RouterModule, MatFormFieldModule, MatInputModule],
  exports: [ReadOnlyFormFieldComponent, ReadOnlyFormFieldWrapperComponent],
})
export class ReadOnlyFormFieldModule {}
