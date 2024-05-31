import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ContentPanelContainerContentComponent } from '../../../../projects/material-addons/src/lib/layout/content-panel/content-panel-container-content/content-panel-container-content.component';
import { ContentPanelContainerComponent } from '../../../../projects/material-addons/src/lib/layout/content-panel/content-panel-container/content-panel-container.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ContentHeaderComponent } from '../../../../projects/material-addons/src/lib/layout/content-panel/content-header/content-header.component';
import { MainContainerComponent } from '../../../../projects/material-addons/src/lib/layout/content-panel/main-container/main-container.component';

@Component({
  selector: 'app-base-page-layout',
  templateUrl: './base-page-layout.component.html',
  styleUrls: ['./base-page-layout.component.scss'],
  standalone: true,
  imports: [
    MainContainerComponent,
    ContentHeaderComponent,
    MatButtonModule,
    MatIconModule,
    ContentPanelContainerComponent,
    ContentPanelContainerContentComponent,
  ],
})
export class BasePageLayoutComponent {
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
