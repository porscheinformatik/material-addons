import { Component, Input } from '@angular/core';
import { NavigationEntry } from '../../navigation-entry';
import { NavEntryService } from '../nav-entry.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { SidebarModule } from '@porscheinformatik/material-addons';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'nav-child',
  templateUrl: './nav-child.component.html',
  styleUrls: ['./nav-child.component.scss'],
  imports: [SidebarModule, RouterLinkActive, RouterLink, MatIconModule, NgStyle, MatListModule, TranslateModule],
})
export class NavChildComponent {
  @Input()
  entry: NavigationEntry;

  @Input()
  sublevel = 0;

  constructor(public readonly navEntryService: NavEntryService) {}

  toggleChildren(entry: NavigationEntry): void {
    if (!entry.showChildren) {
      entry.showChildren = true;
    } else {
      entry.showChildren = !entry.showChildren;
    }
  }

  isOpen(entry: NavigationEntry, isRouteActive: boolean): boolean {
    if (typeof entry.showChildren === 'undefined' && isRouteActive) {
      entry.showChildren = true;
      return true;
    }
    return !!entry.showChildren;
  }
}
