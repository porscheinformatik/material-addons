import { AfterViewChecked, ChangeDetectorRef, Component, Input } from '@angular/core';
import { NavigationEntry } from '../navigation-entry';
import { Observable, of } from 'rxjs';
import { NavEntryService } from './nav-entry.service';

@Component({
  selector: 'nav-entry',
  templateUrl: './nav-entry.component.html',
  styleUrls: ['./nav-entry.component.scss'],
})
export class NavEntryComponent implements AfterViewChecked {
  @Input()
  entry: NavigationEntry;

  @Input()
  sublevel = 0;

  constructor(
    private cdRef: ChangeDetectorRef,
    public readonly navEntryService: NavEntryService,
  ) {}

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  toggleChildren(entry: NavigationEntry): void {
    if (!entry.showChildren) {
      entry.showChildren = true;
    } else {
      entry.showChildren = !entry.showChildren;
    }
  }

  isOpen(entry: NavigationEntry, isRouteActive?: boolean): boolean {
    if (typeof entry.showChildren === 'undefined' && isRouteActive) {
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

  hasPermission(_: NavigationEntry): Observable<boolean> {
    return of(true);
  }
}
