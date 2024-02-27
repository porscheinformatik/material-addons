import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FilterComponent } from "./data-table-filter.component";
import { MatIconModule } from "@angular/material/icon";
import { DataTableFilterDialogComponent } from "./data-table-filter-dialog/data-table-filter-dialog.component";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [FilterComponent, DataTableFilterDialogComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  exports: [FilterComponent],
})
export class DataTableFilterComponentModule {}
