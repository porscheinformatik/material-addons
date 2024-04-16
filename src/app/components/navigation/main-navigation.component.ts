import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { NavigationEntry } from './navigation-entry';
import { SidebarComponent } from 'material-addons';
import { VERSION as AngularVersion } from '@angular/core';
import { VERSION as MaterialVersion } from '@angular/material/core';
import { VERSION as AddonsVersion} from '@porscheinformatik/material-addons';

@Component({
  selector: 'main-navigation',
  templateUrl: './main-navigation.component.html',
  styleUrls: ['./main-navigation.component.scss'],
})
export class MainNavigationComponent implements OnInit, OnDestroy {

  @Input()
  navigationEntries: NavigationEntry[];

  @ViewChild('sidebar', { static: true })
  sidebar: SidebarComponent;

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
    this.handsetSubscription = this.isHandset$.subscribe((value) => {
      this.sidebar.collapsed = value;
    });
  }
}
