import { Component, OnInit } from '@angular/core';
import { IStep, FlowbarModule, ButtonModule } from 'material-addons';
import { Router } from '@angular/router';
import { Location, NgFor, NgIf } from '@angular/common';
import { ContentPanelContainerFooterComponent } from '../../../../projects/material-addons/src/lib/layout/content-panel/content-panel-container-footer/content-panel-container-footer.component';
import { ContentPanelContainerContentComponent } from '../../../../projects/material-addons/src/lib/layout/content-panel/content-panel-container-content/content-panel-container-content.component';
import { ContentPanelContainerComponent } from '../../../../projects/material-addons/src/lib/layout/content-panel/content-panel-container/content-panel-container.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ContentHeaderComponent } from '../../../../projects/material-addons/src/lib/layout/content-panel/content-header/content-header.component';
import { MainContainerComponent } from '../../../../projects/material-addons/src/lib/layout/content-panel/main-container/main-container.component';

@Component({
  selector: 'app-flowbar-page-layout',
  templateUrl: './flowbar-page-layout.component.html',
  styleUrls: ['./flowbar-page-layout.component.scss'],
  standalone: true,
  imports: [
    MainContainerComponent,
    ContentHeaderComponent,
    MatButtonModule,
    MatIconModule,
    FlowbarModule,
    ContentPanelContainerComponent,
    ContentPanelContainerContentComponent,
    NgFor,
    ContentPanelContainerFooterComponent,
    NgIf,
    ButtonModule,
  ],
})
export class FlowbarPageLayoutComponent implements OnInit {
  steps: IStep[];
  activeStep: IStep;

  constructor(
    private router: Router,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.steps = [
      { label: '1. Step', enabled: true },
      { label: '2. Step', enabled: true },
      { label: '3. Step', enabled: true },
    ];
  }

  activeStepChanged(step: IStep): void {
    this.activeStep = step;
  }

  public goToPreviousPage(): void {
    this.router.navigate([''], { skipLocationChange: true }).then((canRedirect) => {
      if (canRedirect) {
        this.location.back();
      }
    });
  }
}
