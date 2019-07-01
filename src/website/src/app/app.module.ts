import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatIconModule, MatListModule, MatDialogModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatSidenavModule, MatToolbarModule, MatMenuModule, MatSnackBarModule, MatTooltipModule, MatCardModule, MatTableModule, MatPaginatorModule, MatSortModule, MatSelectModule, MatDatepickerModule } from '@angular/material';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NavChildComponent } from './components/navigation/nav-entry/nav-child/nav-child.component';
import { NavEntryComponent } from './components/navigation/nav-entry/nav-entry.component';
import { UserIdComponent } from './components/navigation/user-id/user-id.component';
import { MainNavigationComponent } from './components/navigation/main-navigation.component';
import { FormsModule } from '@angular/forms';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { ToolbarService } from './components/toolbar/toolbar.service';
import { MaterialActionButtonComponent } from './components/material-action-button/material-action-button.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HomeComponent } from './home/home.component';
import { LinkCardComponent } from './home/link-card/link-card.component';
import { IntroComponent } from './intro/intro.component';
import { TableDemoComponent } from './table-demo/table-demo.component';
import { DetailComponent } from './table-demo/detail/detail.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    NavChildComponent,
    NavEntryComponent,
    UserIdComponent,
    ToolbarComponent,
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
    AppRoutingModule,
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
