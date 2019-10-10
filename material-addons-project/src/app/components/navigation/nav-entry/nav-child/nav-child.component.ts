import {Component, Input, OnInit} from '@angular/core';
import { NavigationEntry } from '../../navigation-entry';

@Component({
  selector: 'nav-child',
  templateUrl: './nav-child.component.html',
  styleUrls: ['./nav-child.component.scss']
})
export class NavChildComponent implements OnInit {

  @Input()
  entry: NavigationEntry;

  @Input()
  sublevel = 0;

  constructor() {
  }

  ngOnInit() {
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
}
