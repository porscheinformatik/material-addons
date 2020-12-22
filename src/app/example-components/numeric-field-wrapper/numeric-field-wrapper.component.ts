import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-numeric-field-wrapper',
  templateUrl: './numeric-field-wrapper.component.html',
  styleUrls: ['./numeric-field-wrapper.component.scss'],
})
export class NumericFieldWrapperComponent implements OnInit {
  form: FormGroup;
  textIsEditable = true;
  ngOnInit(): void {
    this.form = new FormGroup({
      // eslint-disable-next-line
      moneyAmount: new FormControl(undefined, { validators: [Validators.required, Validators.min(0)], updateOn: 'blur' }),
      weight: new FormControl(undefined, { validators: [Validators.required, Validators.min(0)], updateOn: 'blur' }),
      emission: new FormControl(undefined, { validators: [Validators.required, Validators.min(0)], updateOn: 'blur' }),
      kilometer: new FormControl(undefined, { validators: [Validators.required, Validators.min(0)], updateOn: 'blur' }),
      cubicCapacity: new FormControl(undefined, { validators: [Validators.required, Validators.min(0)], updateOn: 'blur' }),
      millimeter: new FormControl(undefined, { validators: [Validators.required, Validators.min(0)], updateOn: 'blur' }),
      kilowatt: new FormControl(undefined, { validators: [Validators.required, Validators.min(0)], updateOn: 'blur' }),
      timeunit: new FormControl(undefined, { validators: [Validators.required, Validators.min(0)], updateOn: 'blur' }),
      horsepower: new FormControl(undefined, { validators: [Validators.required, Validators.min(0)], updateOn: 'blur' }),
      percentage: new FormControl(undefined, { validators: [Validators.min(0), Validators.max(100)], updateOn: 'blur' })
    });
  }
}
