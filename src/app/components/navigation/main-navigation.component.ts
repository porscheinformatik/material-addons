import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ModuleEntry } from './module-entry';
import { NavigationEntry } from './navigation-entry';

@Component({
  selector: 'main-navigation',
  templateUrl: './main-navigation.component.html',
  styleUrls: ['./main-navigation.component.scss'],
})
export class MainNavigationComponent implements OnInit, OnDestroy {
  @Input()
  moduleEntries: ModuleEntry[];

  @Input()
  navigationEntries: NavigationEntry[];

  @Input()
  currentModuleName = 'My module';

  hideNavigation = false;

  @ViewChild('drawer', { static: true })
  drawer: MatDrawer;

  currentModule: ModuleEntry;

  routerSubscription: Subscription;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.Handset, Breakpoints.Tablet])
    .pipe(map((result) => result.matches));

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    public dialog: MatDialog,
  ) {
    this.routerSubscription = this.router.events.pipe(filter((event) => event instanceof NavigationStart)).subscribe(() => {
      if (this.drawer.mode !== 'side' && this.drawer.opened) {
        this.drawer.close();
      }
    });
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  collapseAll(): void {
    this.navigationEntries.filter((value) => typeof value.showChildren !== 'undefined').forEach((value) => (value.showChildren = false));
  }

  ngOnInit(): void {
    this.moduleEntries.filter((value) => value.name === this.currentModuleName).forEach((value) => (this.currentModule = value));
  }
}
