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
      percentage: new FormControl(undefined, { validators: [Validators.min(0), Validators.max(100)], updateOn: 'blur' }),
      // eslint-disable-next-line
      numericValue: new FormControl(undefined, { validators: [Validators.required], updateOn: 'blur' }),
    });
  }
}
