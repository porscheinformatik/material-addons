import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { NavigationEntry } from './navigation-entry';
import { ContentPanelModule, SidebarComponent, SidebarModule } from '@porscheinformatik/material-addons';
import { VERSION as AngularVersion } from '@angular/core';
import { VERSION as MaterialVersion } from '@angular/material/core';
import { VERSION as AddonsVersion } from '@porscheinformatik/material-addons';
import { RouterOutlet } from '@angular/router';
import { ExamplePageTitleComponent } from '../example-page-title/example-page-title.component';
import { NavEntryComponent } from './nav-entry/nav-entry.component';
import { NgFor } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { ExampleHeaderComponent } from '../example-header/example-header.component';

@Component({
  selector: 'main-navigation',
  templateUrl: './main-navigation.component.html',
  styleUrls: ['./main-navigation.component.scss'],
  standalone: true,
  imports: [
    ContentPanelModule,
    ExampleHeaderComponent,
    SidebarModule,
    MatDividerModule,
    MatListModule,
    NgFor,
    NavEntryComponent,
    ExamplePageTitleComponent,
    RouterOutlet,
  ],
})
export class MainNavigationComponent implements OnInit, OnDestroy {
  @Input({ required: true }) navigationEntries: NavigationEntry[];

  @ViewChild('sidebar', { static: true }) sidebar: SidebarComponent;

  handsetSubscription: Subscription;

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

  ngOnDestroy(): void {
    this.handsetSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.handsetSubscription = this.isHandset$.subscribe((value) => (this.sidebar.collapsed = value));
  }
}
