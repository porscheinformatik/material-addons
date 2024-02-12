import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReadOnlyFormFieldWrapperComponent } from './readonly-form-field-wrapper/readonly-form-field-wrapper.component';
import { ReadOnlyFormFieldComponent } from './readonly-form-field/readonly-form-field.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [ReadOnlyFormFieldComponent, ReadOnlyFormFieldWrapperComponent],
  imports: [CommonModule, RouterModule, MatFormFieldModule, MatInputModule, FormsModule, MatTooltipModule, MatIconModule],
  exports: [ReadOnlyFormFieldComponent, ReadOnlyFormFieldWrapperComponent],
})
export class ReadOnlyFormFieldModule {}
