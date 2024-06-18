import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'mad-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
})
export class SidebarComponent {
  @Input() collapsed = false;

  toggleCollapse() {
    this.collapsed = !this.collapsed;
  }
}
