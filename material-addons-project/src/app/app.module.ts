import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialActionButtonModule, ReadOnlyFormFieldModule } from '@porscheinformatik/material-addons';
import { IntroComponent } from './intro/intro.component';
import { NavChildComponent } from './components/navigation/nav-entry/nav-child/nav-child.component';
import { NavEntryComponent } from './components/navigation/nav-entry/nav-entry.component';
import { UserIdComponent } from './components/navigation/user-id/user-id.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MainNavigationComponent } from './components/navigation/main-navigation.component';
import { LinkCardComponent } from './home/link-card/link-card.component';
import { HomeComponent } from './home/home.component';
import { TableDemoComponent } from './table-demo/table-demo.component';
import { DetailComponent } from './table-demo/detail/detail.component';
import {MatAutocompleteModule, 
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
        MatDatepickerModule } from '@angular/material';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ToolbarService } from './components/toolbar/toolbar.service';
import {FlexLayoutModule} from '@angular/flex-layout';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/');
}

@NgModule({
  declarations: [
    AppComponent,
    NavChildComponent,
    NavEntryComponent,
    UserIdComponent,
    ToolbarComponent,
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
    AppRoutingModule,
    MaterialActionButtonModule,
    ReadOnlyFormFieldModule,
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
    MatDatepickerModule
  ],
  providers: [ToolbarService],
  bootstrap: [AppComponent],
  entryComponents: [
    UserIdComponent
  ]
})
export class AppModule { }
