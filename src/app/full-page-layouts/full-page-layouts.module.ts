import { CommonModule } from '@angular/common';
import { FullPageLayoutsRoutingModule } from './full-page-layouts-routing.module';
import { FullPageLayoutsComponent } from './full-page-layouts.component';
import { BasePageLayoutComponent } from './base-page-layout/base-page-layout.component';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { PortalModule } from '@angular/cdk/portal';
import { MatTabsModule } from '@angular/material/tabs';
import {
  ButtonModule,
  CardModule,
  FlowbarModule,
  NumericFieldModule,
  QuickListModule,
  TableModule,
  ThrottleClickModule,
} from 'material-addons';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ContentPanelModule } from '../../../projects/material-addons/src/lib/content-panel/content-panel.module';
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
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatDatepickerModule,
    PortalModule,
    MatTabsModule,
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
export class FullPageLayoutsModule {}
