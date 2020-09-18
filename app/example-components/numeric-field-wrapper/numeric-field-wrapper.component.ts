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

  ngOnInit() {
    this.form = new FormGroup({
      moneyAmount: new FormControl(undefined, { validators: [Validators.required, Validators.min(0)], updateOn: 'blur' }),
      percentage: new FormControl(undefined, { validators: [Validators.min(0), Validators.max(100)], updateOn: 'blur' }),
    });
  }
}
