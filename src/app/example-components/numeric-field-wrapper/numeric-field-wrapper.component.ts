import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, ValidatorFn } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NumericFieldModule, ReadOnlyFormFieldModule } from '@porscheinformatik/material-addons';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-numeric-field-wrapper',
  templateUrl: './numeric-field-wrapper.component.html',
  styleUrls: ['./numeric-field-wrapper.component.scss'],
  imports: [MatCheckboxModule, ReactiveFormsModule, ReadOnlyFormFieldModule, MatFormFieldModule, MatInputModule, NumericFieldModule],
})
export class NumericFieldWrapperComponent {
  readonly form = new FormGroup({
    defaultValue: this.createControl(1234.56),
    moneyAmount: this.createControl(1234.5, [Validators.required, Validators.min(0)]),
    integerValue: this.createControl(12000, [Validators.required, Validators.min(0)]),
    precisionValue: this.createControl(12.3456, [Validators.required, Validators.min(0)]),
    rightUnitValue: this.createControl(1540, [Validators.required, Validators.min(0)]),
    leftUnitValue: this.createControl(99.99, [Validators.required, Validators.min(0)]),
    roundedValue: this.createControl(1234.567, [Validators.required, Validators.min(0)]),
    percentage: this.createControl(120, [Validators.min(0), Validators.max(100)]),
  });
  textIsEditable = true;

  get disabled(): boolean {
    return this.form.disabled;
  }

  setDisabledState(disabled: boolean): void {
    if (disabled) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  private createControl(value: number, validators: ValidatorFn[] = []): FormControl<number | null | undefined> {
    return new FormControl<number | null | undefined>(value, { validators, updateOn: 'blur' });
  }
}
