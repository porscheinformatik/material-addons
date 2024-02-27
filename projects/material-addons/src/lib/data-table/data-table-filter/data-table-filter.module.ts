import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DataTableFilter } from "./data-table-filter.directive";
import { DataTableFilterComponentModule } from "./data-table-filter-component/data-table-filter.component.module";
import { DataTableFilterHeader } from "./data-table-filter-header.directive";

@NgModule({
  declarations: [DataTableFilter, DataTableFilterHeader],
  imports: [CommonModule, DataTableFilterComponentModule],
  exports: [DataTableFilter, DataTableFilterHeader],
})
export class DataTableFilterModule {}
