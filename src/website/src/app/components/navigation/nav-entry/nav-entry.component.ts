import {AfterViewChecked, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {NavigationEntry} from '../navigation-entry';
import {combineLatest, Observable, of} from 'rxjs';

@Component({
  selector: 'nav-entry',
  templateUrl: './nav-entry.component.html',
  styleUrls: ['./nav-entry.component.scss']
})
export class NavEntryComponent implements OnInit, AfterViewChecked {

  @Input()
  entry: NavigationEntry;

  @Input()
  sublevel = 0;

  constructor(private cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  toggleChildren(entry: NavigationEntry) {
    if (!entry.showChildren) {
      entry.showChildren = true;
    } else {
      entry.showChildren = !entry.showChildren;
    }
  }

  isOpen(entry: NavigationEntry, isRouteActive: boolean) {
    if ((entry.showChildren === undefined) && isRouteActive) {
      entry.showChildren = true;
      return true;
    }
    return !!entry.showChildren;
  }

  hasRights(entry: NavigationEntry): Observable<boolean> {
    if (!entry || !entry.roles) {
      return of(true);
    }
    return of(true);
  }



  hasPermission(entry: NavigationEntry) {
    return of(true);
  }
}
