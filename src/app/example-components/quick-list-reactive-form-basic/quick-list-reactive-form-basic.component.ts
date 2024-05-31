import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { QuickListModule, ReadOnlyFormFieldModule } from 'material-addons';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-quick-list-reactive-form-basic',
  templateUrl: './quick-list-reactive-form-basic.component.html',
  styleUrls: ['./quick-list-reactive-form-basic.component.scss'],
  standalone: true,
  imports: [
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    QuickListModule,
    ReadOnlyFormFieldModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class QuickListReactiveFormBasicComponent implements OnInit {
  formGroup: FormGroup;
  textIsEditable = true;

  constructor(private formBuilder: FormBuilder) {}

  get array(): FormArray {
    return this.formGroup?.get('array') as FormArray;
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      test: 'test',
      array: this.formBuilder.array(
        [
          this.formBuilder.group({
            id: [1, [Validators.required, Validators.min(1)]],
            name: ['Name 1', [Validators.required, Validators.maxLength(50)]],
          }),
        ],
        [Validators.minLength(1), Validators.maxLength(5)],
      ),
    });
  }

  onItemAdded(): void {
    this.array.push(
      this.formBuilder.group({
        id: [null, [Validators.required, Validators.min(1)]],
        name: [null, [Validators.required, Validators.maxLength(50)]],
      }),
    );
    this.formGroup.updateValueAndValidity();
  }

  onItemRemoved(): void {}
}
