import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDrawer, MatSnackBar } from '@angular/material';
import { NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ModuleEntry } from './module-entry';
import { NavigationEntry } from './navigation-entry';
import { UserIdComponent } from './user-id/user-id.component';

@Component({
  selector: 'main-navigation',
  templateUrl: './main-navigation.component.html',
  styleUrls: ['./main-navigation.component.scss']
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

  isDeveloper = false;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet])
    .pipe(
      map(result => result.matches)
    );


  constructor(private breakpointObserver: BreakpointObserver,
              private snackBar: MatSnackBar,
              private router: Router,
              public dialog: MatDialog,
              private translateService: TranslateService) {
    this.routerSubscription = this.router.events.subscribe(routingEvent => {
      if (routingEvent instanceof NavigationStart) {
        if (this.drawer.mode !== 'side' && this.drawer.opened) {
          this.drawer.close();
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  collapseAll() {
    this.navigationEntries.forEach(value => {
      if (value.showChildren !== undefined) {
        value.showChildren = false;
      }
    });
  }

  logoutPressed() {
    this.snackBar.open('Much wow',
      'Ok', { duration: 10000 });
  }

  userInfoPressed() {
    this.dialog.open(UserIdComponent, {
      width: '800px'
    });
  }

  showShortcuts() {
    this.translateService.get('hotkeyMessage').toPromise().then(value => {
      this.snackBar.open(value,
        'Ok', { duration: 10000 });
    });

  }

  ngOnInit(): void {
    this.moduleEntries.forEach(value => {
      if (value.name === this.currentModuleName) {
        this.currentModule = value;
      }
    });
  }

}
