import { Component, Input } from '@angular/core';

@Component({
  selector: 'mad-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Input() collapsed = false;

  toggleCollapse() {
    this.collapsed = !this.collapsed;
  }
}
