import { CommonModule } from '@angular/common';
import { FullPageLayoutsRoutingModule } from './full-page-layouts-routing.module';
import { FullPageLayoutsComponent } from './full-page-layouts.component';
import { BasePageLayoutComponent } from './base-page-layout/base-page-layout.component';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatIconModule} from '@angular/material/icon';
import {MatLegacyListModule as MatListModule} from '@angular/material/legacy-list';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {MatLegacyCheckboxModule as MatCheckboxModule} from '@angular/material/legacy-checkbox';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatLegacyMenuModule as MatMenuModule} from '@angular/material/legacy-menu';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';
import {MatLegacySnackBarModule as MatSnackBarModule} from '@angular/material/legacy-snack-bar';
import {MatLegacyCardModule as MatCardModule} from '@angular/material/legacy-card';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatLegacyTableModule as MatTableModule} from '@angular/material/legacy-table';
import {MatLegacyPaginatorModule as MatPaginatorModule} from '@angular/material/legacy-paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {PortalModule} from '@angular/cdk/portal';
import {MatLegacyTabsModule as MatTabsModule} from '@angular/material/legacy-tabs';
import {
  ButtonModule,
  CardModule, FlowbarModule,
  NumericFieldModule,
  QuickListModule,
  TableModule,
  ThrottleClickModule
} from 'material-addons';
import {MatLegacyProgressSpinnerModule as MatProgressSpinnerModule} from '@angular/material/legacy-progress-spinner';
import {ContentPanelModule} from '../../../projects/material-addons/src/lib/content-panel/content-panel.module';
import { FlowbarPageLayoutComponent } from './flowbar-page-layout/flowbar-page-layout.component';

@NgModule({
  imports: [
    CommonModule,
    FullPageLayoutsRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDialogModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSidenavModule,
    MatToolbarModule,
    MatMenuModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatCardModule,
    FlexLayoutModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatDatepickerModule,
    PortalModule,
    MatTabsModule,
    FlexLayoutModule,
    NumericFieldModule.forRoot(),
    CardModule,
    MatProgressSpinnerModule,
    QuickListModule,
    TableModule,
    ButtonModule,
    ThrottleClickModule,
    ContentPanelModule,
    FlowbarModule,
  ],
  declarations: [FullPageLayoutsComponent, BasePageLayoutComponent, FlowbarPageLayoutComponent],
})
export class FullPageLayoutsModule { }
