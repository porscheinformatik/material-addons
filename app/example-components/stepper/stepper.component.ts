import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
})
export class StepperComponent implements OnInit {
  @Input() linear: boolean = true;
  personForm: FormGroup;
  contactInformationForm: FormGroup;

  constructor() {}

  ngOnInit(): void {
    this.personForm = new FormGroup({
      firstName: new FormControl('',[Validators.required]),
      lastName: new FormControl('',[Validators.required]),
    });

    this.contactInformationForm = new FormGroup({
      email: new FormControl('',[Validators.required]),
      phone: new FormControl('',[Validators.required]),
    });
  }
}
