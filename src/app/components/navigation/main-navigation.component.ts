import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NavigationEntry } from './navigation-entry';
import { ContentPanelModule, SidebarModule } from '@porscheinformatik/material-addons';
import { VERSION as AngularVersion } from '@angular/core';
import { VERSION as MaterialVersion } from '@angular/material/core';
import { VERSION as AddonsVersion } from '@porscheinformatik/material-addons';
import { RouterOutlet } from '@angular/router';
import { ExamplePageTitleComponent } from '../example-page-title/example-page-title.component';
import { NavEntryComponent } from './nav-entry/nav-entry.component';

import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { ExampleHeaderComponent } from '../example-header/example-header.component';

@Component({
  selector: 'main-navigation',
  templateUrl: './main-navigation.component.html',
  styleUrls: ['./main-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ContentPanelModule,
    ExampleHeaderComponent,
    SidebarModule,
    MatDividerModule,
    MatListModule,
    NavEntryComponent,
    ExamplePageTitleComponent,
    RouterOutlet,
    AsyncPipe,
  ],
})
export class MainNavigationComponent {
  @Input({ required: true }) navigationEntries: NavigationEntry[];

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.Handset, Breakpoints.Tablet])
    .pipe(map((result) => result.matches));

  angularVersion = AngularVersion.full;
  materialVersion = MaterialVersion.full;
  addonsVersion = AddonsVersion;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
  ) {}
}
