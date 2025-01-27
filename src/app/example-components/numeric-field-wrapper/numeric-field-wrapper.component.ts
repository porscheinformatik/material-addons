import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReadOnlyFormFieldModule, NumericFieldModule } from '@porscheinformatik/material-addons';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
    selector: 'app-numeric-field-wrapper',
    templateUrl: './numeric-field-wrapper.component.html',
    styleUrls: ['./numeric-field-wrapper.component.scss'],
    imports: [
        MatCheckboxModule,
        FormsModule,
        ReactiveFormsModule,
        ReadOnlyFormFieldModule,
        MatFormFieldModule,
        MatInputModule,
        NumericFieldModule,
        NgIf,
    ]
})
export class NumericFieldWrapperComponent implements OnInit {
  form: UntypedFormGroup;
  textIsEditable = true;

  ngOnInit(): void {
    this.form = new UntypedFormGroup({
      // eslint-disable-next-line
      moneyAmount: new UntypedFormControl(undefined, {
        validators: [Validators.required, Validators.min(0)],
        updateOn: 'blur',
      }),
      weight: new UntypedFormControl(undefined, {
        validators: [Validators.required, Validators.min(0)],
        updateOn: 'blur',
      }),
      emission: new UntypedFormControl(undefined, {
        validators: [Validators.required, Validators.min(0)],
        updateOn: 'blur',
      }),
      kilometer: new UntypedFormControl(undefined, {
        validators: [Validators.required, Validators.min(0)],
        updateOn: 'blur',
      }),
      cubicCapacity: new UntypedFormControl(undefined, {
        validators: [Validators.required, Validators.min(0)],
        updateOn: 'blur',
      }),
      millimeter: new UntypedFormControl(undefined, {
        validators: [Validators.required, Validators.min(0)],
        updateOn: 'blur',
      }),
      kilowatt: new UntypedFormControl(undefined, {
        validators: [Validators.required, Validators.min(0)],
        updateOn: 'blur',
      }),
      timeunit: new UntypedFormControl(undefined, {
        validators: [Validators.required, Validators.min(0)],
        updateOn: 'blur',
      }),
      horsepower: new UntypedFormControl(undefined, {
        validators: [Validators.required, Validators.min(0)],
        updateOn: 'blur',
      }),
      percentage: new UntypedFormControl(undefined, {
        validators: [Validators.min(0), Validators.max(100)],
        updateOn: 'blur',
      }),
    });
  }
}
