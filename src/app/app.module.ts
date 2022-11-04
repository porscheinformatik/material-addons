import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IntroComponent } from './intro/intro.component';
import { NavChildComponent } from './components/navigation/nav-entry/nav-child/nav-child.component';
import { NavEntryComponent } from './components/navigation/nav-entry/nav-entry.component';
import { UserIdComponent } from './components/navigation/user-id/user-id.component';
import { MainNavigationComponent } from './components/navigation/main-navigation.component';
import { LinkCardComponent } from './home/link-card/link-card.component';
import { HomeComponent } from './home/home.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ReadOnlyDemoComponent } from './component-demos/read-only-demo/read-only-demo.component';
import { ExampleViewerComponent } from './components/example-viewer/example-viewer.component';
import { CommonModule } from '@angular/common';
import { PortalModule } from '@angular/cdk/portal';
import {
  ButtonModule,
  CardModule,
  ContentPanelModule,
  DataTableModule,
  FlowbarModule,
  MaterialActionButtonModule,
  NumericFieldModule,
  QuickListModule,
  ReadOnlyFormFieldModule,
  TableModule,
  ThrottleClickModule,
  ToolbarModule,
} from '@porscheinformatik/material-addons';
import { ReadOnlyFieldComponent } from './example-components/read-only-field/read-only-field.component';
import { ReadOnlyFieldWrapperComponent } from './example-components/read-only-field-wrapper/read-only-field-wrapper.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { InternationalizationComponent } from './internationalization/internationalization.component';
import { ToolbarDemoComponent } from './component-demos/toolbar-demo/toolbar-demo.component';
import { ActionButtonDemoComponent } from './component-demos/action-button-demo/action-button-demo.component';
import { ActionButtonComponent } from './example-components/action-button/action-button.component';
import { ToolbarComponent } from './example-components/toolbar/toolbar.component';
import { TextCodeComponent } from './components/text-code/text-code.component';
import { NumericFieldWrapperComponent } from './example-components/numeric-field-wrapper/numeric-field-wrapper.component';
import { NumericFieldDemoComponent } from './component-demos/numeric-field-demo/numeric-field-demo.component';
import { CardEditableComponent } from './example-components/card-editable/card-editable.component';
import { CardReadonlyComponent } from './example-components/card-readonly/card-readonly.component';
import { CardDemoComponent } from './component-demos/card-demo/card-demo.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { QuickListBasicComponent } from './example-components/quick-list-basic/quick-list-basic.component';
import { QuickListDemoComponent } from './component-demos/quick-list-demo/quick-list-demo.component';
import { TableDemoComponent } from './component-demos/table-demo/table-demo.component';
import { DataTableDemoComponent } from './component-demos/data-table-demo/data-table-demo.component';
import { TableComponent } from './example-components/table/table.component';
import { DataTableBasicComponent } from './example-components/data-table-basic/data-table-basic.component';
import { CardExpandableComponent } from './example-components/card-expandable/card-expandable.component';
import { ReadOnlyFieldErrorComponent } from './example-components/read-only-field-error/read-only-field-error.component';
import { QuickListExtendedComponent } from './example-components/quick-list-extended/quick-list-extended.component';
import { MadButtonsComponent } from './example-components/mad-buttons/mad-buttons.component';
import { MadButtonsDemoComponent } from './component-demos/mad-buttons-demo/mad-buttons-demo.component';
import { ThrottleClickComponent } from './example-components/throttle-click/throttle-click.component';
import { ThrottleClickDemoComponent } from './component-demos/throttle-click-demo/throttle-click-demo.component';
import { StepperModule } from '../../projects/material-addons/src/lib/stepper/stepper.module';
import { StepperComponent } from './example-components/stepper/stepper.component';
import { StepperDemoComponent } from './component-demos/stepper-demo/stepper-demo.component';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { MatStepperModule } from '@angular/material/stepper';
import { QuickListCompactBasicComponent } from './example-components/quick-list-compact-basic/quick-list-compact-basic.component';
import { PageLayoutsComponent } from './component-demos/page-layouts/page-layouts.component';
import { FullPageLayoutsModule } from './full-page-layouts/full-page-layouts.module';
import { ExampleComponentsLayoutComponent } from './example-components-layout/example-components-layout.component';
import { DataTableCustomColumnsComponent } from './example-components/data-table-custom-columns/data-table-custom-columns.component';
import { DataTableBatchModeComponent } from './example-components/data-table-batch-mode/data-table-batch-mode.component';
import { DataTableSingleComponent } from './example-components/data-table-single/data-table-single.component';
import { DataTableAsyncComponent } from './example-components/data-table-async/data-table-async.component';
import { DataTableIdGeneratorComponent } from './example-components/data-table-id-generator/data-table-id-generator.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DataTableColumnConfigurationComponent } from './example-components/data-table-column-configuration/data-table-column-configuration.component';
import { DataTableSummaryComponent } from './example-components/data-table-summary/data-table-summary.component';
import { DataTableParentHeightComponent } from './example-components/data-table-parent-height/data-table-parent-height.component';
import { DataTableDevModule } from './dev-components/data-table/data-table-dev.module';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/');
}

@NgModule({
  declarations: [
    AppComponent,
    NavChildComponent,
    NavEntryComponent,
    UserIdComponent,
    MainNavigationComponent,
    AppComponent,
    LinkCardComponent,
    HomeComponent,
    IntroComponent,
    ReadOnlyDemoComponent,
    ExampleViewerComponent,
    ReadOnlyFieldComponent,
    ReadOnlyFieldWrapperComponent,
    InternationalizationComponent,
    ToolbarDemoComponent,
    ActionButtonDemoComponent,
    ActionButtonComponent,
    ToolbarComponent,
    TextCodeComponent,
    NumericFieldDemoComponent,
    NumericFieldWrapperComponent,
    CardDemoComponent,
    CardEditableComponent,
    CardReadonlyComponent,
    MadButtonsComponent,
    QuickListDemoComponent,
    QuickListBasicComponent,
    QuickListExtendedComponent,
    TableDemoComponent,
    DataTableDemoComponent,
    TableComponent,
    DataTableCustomColumnsComponent,
    DataTableAsyncComponent,
    DataTableBasicComponent,
    DataTableBatchModeComponent,
    DataTableIdGeneratorComponent,
    DataTableSingleComponent,
    DataTableColumnConfigurationComponent,
    DataTableSummaryComponent,
    DataTableParentHeightComponent,
    CardExpandableComponent,
    ReadOnlyFieldErrorComponent,
    MadButtonsDemoComponent,
    ThrottleClickComponent,
    ThrottleClickDemoComponent,
    QuickListCompactBasicComponent,
    StepperComponent,
    StepperDemoComponent,
    PageLayoutsComponent,
    ExampleComponentsLayoutComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    ButtonModule,
    MaterialActionButtonModule,
    ReadOnlyFormFieldModule,
    ToolbarModule,
    MatAutocompleteModule,
    MatNativeDateModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
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
    DataTableModule,
    ButtonModule,
    ThrottleClickModule,
    CdkStepperModule,
    MatStepperModule,
    StepperModule,
    ContentPanelModule,
    FullPageLayoutsModule,
    FlowbarModule,
    MatSlideToggleModule,
    DataTableDevModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
