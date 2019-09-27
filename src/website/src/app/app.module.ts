import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatSelectModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {NavChildComponent} from './components/navigation/nav-entry/nav-child/nav-child.component';
import {NavEntryComponent} from './components/navigation/nav-entry/nav-entry.component';
import {UserIdComponent} from './components/navigation/user-id/user-id.component';
import {MainNavigationComponent} from './components/navigation/main-navigation.component';
import {FormsModule} from '@angular/forms';
import {ToolbarComponent} from './components/toolbar/toolbar.component';
import {ToolbarService} from './components/toolbar/toolbar.service';
import {MaterialActionButtonComponent} from './components/material-action-button/material-action-button.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HomeComponent} from './home/home.component';
import {LinkCardComponent} from './home/link-card/link-card.component';
import {IntroComponent} from './intro/intro.component';
import {TableDemoComponent} from './table-demo/table-demo.component';
import {DetailComponent} from './table-demo/detail/detail.component';
import {ReadOnlyFormFieldWrapperComponent} from './components/readonly/readonly-form-field-wrapper/readonly-form-field-wrapper.component';
import {ReadOnlyFormFieldComponent} from './components/readonly/readonly-form-field/readonly-form-field.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/');
}

@NgModule({
  declarations: [
    NavChildComponent,
    NavEntryComponent,
    UserIdComponent,
    ToolbarComponent,
    ReadOnlyFormFieldComponent,
    ReadOnlyFormFieldWrapperComponent,
    MaterialActionButtonComponent,
    MainNavigationComponent,
    AppComponent,
    LinkCardComponent,
    HomeComponent,
    IntroComponent,
    TableDemoComponent,
    DetailComponent
  ],
  imports: [
    BrowserModule,
    MatAutocompleteModule,
    AppRoutingModule,
    HttpClientModule,
    MatNativeDateModule,
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
    MatDatepickerModule
  ],
  providers: [ToolbarService],
  bootstrap: [AppComponent],
  entryComponents: [
    UserIdComponent
  ]
})
export class AppModule {
}
