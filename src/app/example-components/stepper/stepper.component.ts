import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
})
export class StepperComponent implements OnInit {
  @Input() linear: boolean = true;
  personForm: UntypedFormGroup;
  contactInformationForm: UntypedFormGroup;

  constructor() {}

  ngOnInit(): void {
    this.personForm = new UntypedFormGroup({
      firstName: new UntypedFormControl('', [Validators.required]),
      lastName: new UntypedFormControl('', [Validators.required]),
    });

    this.contactInformationForm = new UntypedFormGroup({
      email: new UntypedFormControl('', [Validators.required]),
      phone: new UntypedFormControl('', [Validators.required]),
    });
  }
}
