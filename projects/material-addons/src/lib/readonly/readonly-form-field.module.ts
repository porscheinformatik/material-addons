import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReadOnlyFormFieldWrapperComponent } from './readonly-form-field-wrapper/readonly-form-field-wrapper.component';
import { ReadOnlyFormFieldComponent } from './readonly-form-field/readonly-form-field.component';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { FormsModule } from '@angular/forms';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

@NgModule({
  declarations: [ReadOnlyFormFieldComponent, ReadOnlyFormFieldWrapperComponent],
  imports: [CommonModule, RouterModule, MatFormFieldModule, MatInputModule, FormsModule, MatTooltipModule],
  exports: [ReadOnlyFormFieldComponent, ReadOnlyFormFieldWrapperComponent],
})
export class ReadOnlyFormFieldModule {}
