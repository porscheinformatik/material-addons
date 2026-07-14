import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NumericFieldModule, ReadOnlyFormFieldModule } from '@porscheinformatik/material-addons';

type NumericValueControl = FormControl<number | null | undefined>;

const REQUIRED_VALIDATOR = (control: AbstractControl): ValidationErrors | null => Validators.required(control);

interface NumericFieldDemoForm {
  defaultValue: NumericValueControl;
  moneyAmount: NumericValueControl;
  integerValue: NumericValueControl;
  precisionValue: NumericValueControl;
  rightUnitValue: NumericValueControl;
  leftUnitValue: NumericValueControl;
  roundedValue: NumericValueControl;
  percentage: NumericValueControl;
}

@Component({
  selector: 'app-numeric-field-wrapper',
  templateUrl: './numeric-field-wrapper.component.html',
  styleUrls: ['./numeric-field-wrapper.component.scss'],
  imports: [MatCheckboxModule, ReactiveFormsModule, ReadOnlyFormFieldModule, MatFormFieldModule, MatInputModule, NumericFieldModule],
})
export class NumericFieldWrapperComponent {
  textIsEditable = true;
  disabled = false;

  readonly form = new FormGroup<NumericFieldDemoForm>({
    defaultValue: new FormControl<number | null | undefined>(1234.56),
    moneyAmount: new FormControl<number | null | undefined>(1234.5, {
      validators: [REQUIRED_VALIDATOR, Validators.min(0)],
      updateOn: 'blur',
    }),
    integerValue: new FormControl<number | null | undefined>(50000, {
      validators: [REQUIRED_VALIDATOR, Validators.min(0)],
      updateOn: 'blur',
    }),
    precisionValue: new FormControl<number | null | undefined>(12.3456, {
      validators: [REQUIRED_VALIDATOR, Validators.min(0)],
      updateOn: 'blur',
    }),
    rightUnitValue: new FormControl<number | null | undefined>(1540, {
      validators: [REQUIRED_VALIDATOR, Validators.min(0)],
      updateOn: 'blur',
    }),
    leftUnitValue: new FormControl<number | null | undefined>(99.99, {
      validators: [REQUIRED_VALIDATOR, Validators.min(0)],
      updateOn: 'blur',
    }),
    roundedValue: new FormControl<number | null | undefined>(1234.567, {
      validators: [REQUIRED_VALIDATOR, Validators.min(0)],
      updateOn: 'blur',
    }),
    percentage: new FormControl<number | null | undefined>(25, {
      validators: [REQUIRED_VALIDATOR, Validators.min(0), Validators.max(100)],
      updateOn: 'blur',
    }),
  });

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;

    if (disabled) {
      this.form.disable({ emitEvent: false });
    } else {
      this.form.enable({ emitEvent: false });
    }
  }
}
