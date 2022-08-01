import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FilterSelectorComponent} from './filter-selector.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {ReadOnlyFormFieldModule} from "../readonly/readonly-form-field.module";


@NgModule({
  declarations: [FilterSelectorComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatCheckboxModule,
    ReadOnlyFormFieldModule
  ], exports: [
    FilterSelectorComponent
  ]
})
export class FilterSelectorModule {
}
