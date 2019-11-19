import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IntroComponent } from './intro/intro.component';
import { NavChildComponent } from './components/navigation/nav-entry/nav-child/nav-child.component';
import { NavEntryComponent } from './components/navigation/nav-entry/nav-entry.component';
import { UserIdComponent } from './components/navigation/user-id/user-id.component';
import { MainNavigationComponent } from './components/navigation/main-navigation.component';
import { LinkCardComponent } from './home/link-card/link-card.component';
import { HomeComponent } from './home/home.component';
import { TableDemoComponent } from './demos/table-demo/table-demo.component';
import { DetailComponent } from './demos/table-demo/detail/detail.component';
import {
  MatAutocompleteModule,
  MatNativeDateModule,
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
  MatDatepickerModule, MatTabsModule
} from '@angular/material';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { ReadOnlyDemoComponent } from './component-demos/read-only-demo/read-only-demo.component';
import { ExampleViewerComponent } from './components/example-viewer/example-viewer.component';
import {CommonModule} from "@angular/common";
import {PortalModule} from "@angular/cdk/portal";
import {MaterialActionButtonModule, ReadOnlyFormFieldModule, ToolbarModule} from "@porscheinformatik/material-addons";
import { ReadOnlyFieldComponent } from './example-components/read-only-field/read-only-field.component';
import { ReadOnlyFieldWrapperComponent } from './example-components/read-only-field-wrapper/read-only-field-wrapper.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { InternationalizationComponent } from './internationalization/internationalization.component';
import { ToolbarDemoComponent } from './component-demos/toolbar-demo/toolbar-demo.component';
import { ActionButtonDemoComponent } from './component-demos/action-button-demo/action-button-demo.component';
import { ActionButtonComponent } from './example-components/action-button/action-button.component';

export function HttpLoaderFactory(http: HttpClient) {
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
    TableDemoComponent,
    DetailComponent,
    ReadOnlyDemoComponent,
    ExampleViewerComponent,
    ReadOnlyFieldComponent,
    ReadOnlyFieldWrapperComponent,
    InternationalizationComponent,
    ToolbarDemoComponent,
    ActionButtonDemoComponent,
    ActionButtonComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
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
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,
    FormsModule,
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
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    UserIdComponent,
    ReadOnlyFieldComponent,
    ReadOnlyFieldWrapperComponent,
    ActionButtonComponent
  ]
})
export class AppModule { }
