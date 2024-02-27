import { DragDropModule } from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatBadgeModule } from "@angular/material/badge";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatRadioModule } from "@angular/material/radio";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { TranslateModule } from "@ngx-translate/core";
import { DataTableColumnsModalComponent } from "./data-table-columns-modal/data-table-columns-modal.component";
import { DataTableFilterModule } from "./data-table-filter/data-table-filter.module";
import { DATA_TABLE_PERSISTENCE_SERVICE_PROVIDER } from "./data-table-persistence.service";
import { DataTableTemplateCellDefinition } from "./data-table-template/data-table-template-cell-definition.directive";
import { DataTableTemplateColumnDefinition } from "./data-table-template/data-table-template-column-definition.directive";
import { DataTableTemplateExpandableCellDefinition } from "./data-table-template/data-table-template-expandable-cell-definition.directive";
import { DataTableTemplateExpandableColumnDefinition } from "./data-table-template/data-table-template-expandable-column-definition.directive";
import { MAD_DATA_TABL_GLOBAL_CONFIGURATION_PROVIDER } from "./configuration/data-table-global-configuration";
import { DataTableComponent } from "./data-table.component";
import { ButtonModule } from "../button/button.module";

@NgModule({
  declarations: [
    DataTableComponent,
    DataTableColumnsModalComponent,
    DataTableTemplateColumnDefinition,
    DataTableTemplateExpandableColumnDefinition,
    DataTableTemplateExpandableCellDefinition,
    DataTableTemplateCellDefinition,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatProgressSpinnerModule,
    ButtonModule,
    TranslateModule,
    MatCheckboxModule,
    MatRadioModule,
    MatBadgeModule,
    DragDropModule,
    FormsModule,
    DataTableFilterModule,
  ],
  exports: [
    DataTableComponent,
    DataTableColumnsModalComponent,
    DataTableTemplateExpandableColumnDefinition,
    DataTableTemplateExpandableCellDefinition,
    DataTableTemplateColumnDefinition,
    DataTableTemplateCellDefinition,
  ],
  providers: [DATA_TABLE_PERSISTENCE_SERVICE_PROVIDER, MAD_DATA_TABL_GLOBAL_CONFIGURATION_PROVIDER],
})
export class DataTableModule {}
