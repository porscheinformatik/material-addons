import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Location } from '@angular/common';
import { ButtonModule, SidebarModule, ContentPanelModule } from '@porscheinformatik/material-addons';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-sidebar-page-layout',
  templateUrl: './sidebar-page-layout.component.html',
  styleUrls: ['./sidebar-page-layout.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    ButtonModule,
    SidebarModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    ContentPanelModule
  ],
})
export class SidebarPageLayoutComponent {
  constructor(
    private router: Router,
    private location: Location,
  ) {}

  public goToPreviousPage(): void {
    this.router.navigate([''], { skipLocationChange: true }).then((canRedirect) => {
      if (canRedirect) {
        this.location.back();
      }
    });
  }
}
