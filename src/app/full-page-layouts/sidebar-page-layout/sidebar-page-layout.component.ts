import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Location } from '@angular/common';
import { ContentPanelContainerContentComponent } from '../../../../projects/material-addons/src/lib/layout/content-panel/content-panel-container-content/content-panel-container-content.component';
import { ContentPanelContainerSidebarComponent } from '../../../../projects/material-addons/src/lib/layout/content-panel/content-panel-container-sidebar/content-panel-container-sidebar.component';
import { ContentPanelContainerComponent } from '../../../../projects/material-addons/src/lib/layout/content-panel/content-panel-container/content-panel-container.component';
import { ButtonModule, SidebarModule } from 'material-addons';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ContentHeaderComponent } from '../../../../projects/material-addons/src/lib/layout/content-panel/content-header/content-header.component';
import { MainContainerComponent } from '../../../../projects/material-addons/src/lib/layout/content-panel/main-container/main-container.component';

@Component({
  selector: 'app-sidebar-page-layout',
  templateUrl: './sidebar-page-layout.component.html',
  styleUrls: ['./sidebar-page-layout.component.scss'],
  standalone: true,
  imports: [
    MainContainerComponent,
    ContentHeaderComponent,
    MatButtonModule,
    MatIconModule,
    ButtonModule,
    ContentPanelContainerComponent,
    ContentPanelContainerSidebarComponent,
    SidebarModule,
    RouterLink,
    RouterLinkActive,
    ContentPanelContainerContentComponent,
    RouterOutlet,
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
