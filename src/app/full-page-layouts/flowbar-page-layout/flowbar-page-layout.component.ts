import { Component, OnInit } from '@angular/core';
import { IStep, FlowbarModule, ButtonModule, ContentPanelModule } from '@porscheinformatik/material-addons';
import { Router } from '@angular/router';
import { Location, NgFor, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-flowbar-page-layout',
    templateUrl: './flowbar-page-layout.component.html',
    styleUrls: ['./flowbar-page-layout.component.scss'],
    imports: [ContentPanelModule, MatButtonModule, MatIconModule, FlowbarModule, NgFor, NgIf, ButtonModule]
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
