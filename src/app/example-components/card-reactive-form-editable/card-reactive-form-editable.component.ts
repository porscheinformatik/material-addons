import {Component, OnInit} from '@angular/core';
import {of, timer} from 'rxjs';
import {delay, finalize} from 'rxjs/operators';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {CardModule, ReadOnlyFormFieldModule} from "material-addons";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {AsyncPipe, NgIf} from "@angular/common";

@Component({
  standalone: true,
  selector: 'app-card-editable',
  templateUrl: './card-reactive-form-editable.component.html',
  imports: [
    MatCheckboxModule,
    CardModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    ReadOnlyFormFieldModule,
    MatFormFieldModule,
    MatInputModule,
    AsyncPipe,
    NgIf
  ]
})
export class CardReactiveFormEditableComponent implements OnInit {
  isInEditMode = false;
  isLoading = false;
  showHelpIcon = false;

  /* Simulate async translation pipe */
  asyncName = of('Last Name').pipe(delay(1000));

  reactiveFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.reactiveFormGroup = this.formBuilder.group({
      firstName: ['Jane', [Validators.maxLength(50)]],
      lastName: ['Doe', [Validators.required, Validators.maxLength(50)]],
      address: ['1030 Wien Landstraße 111 / 22 / 33', [Validators.required, Validators.maxLength(100)]],
      deliveryAddress: ['5020 Salzburg Leopoldskronstraße 111 / 22 / 33', [Validators.required, Validators.maxLength(100)]]
    });
  }


  onEditMode(): void {
    this.isInEditMode = true;
  }

  onCancel(): void {
    // reset values
    this.isInEditMode = false;
  }

  onSave(): void {
    this.isLoading = true;
    // simulate a HTTP call to the backend
    timer(1500)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(() => (this.isInEditMode = false));
  }

  onAdditionalAction() {
    alert('additional action was clicked!');
  }
}
