import { Component } from '@angular/core';

@Component({
  selector: 'app-page-layouts',
  templateUrl: './page-layouts.component.html',
  styleUrls: ['./page-layouts.component.scss'],
})
export class PageLayoutsComponent {
  basePageLayout =
    `<mad-main-container>
        <mad-content-header>
          <div fxLayout="row" fxLayoutAlign="space-between center">
            <div fxLayout="row" fxLayoutAlign="center center" fxLayoutGap="1em">
              <button mat-button>
                <mat-icon color="primary">arrow_back</mat-icon>
              </button>
              <h2 class="title">Base Pagelayout</h2>
            </div>
          </div>
        </mad-content-header>
        <mad-content-panel-container>
          <mad-content-panel-container-content>
            <p>Define the page content here</p>
          </mad-content-panel-container-content>
          <mad-content-panel-container-footer fxLayoutAlign="space-between center">
            <p>Footer here</p>
          </mad-content-panel-container-footer>
       </mad-content-panel-container>
     </mad-main-container>`;

  flowBarLayout = `
    <mad-main-container>
        <mad-content-header>
            <div fxLayout="row" fxLayoutAlign="space-between center">
                <div fxLayout="row" fxLayoutAlign="center center" fxLayoutGap="1em">
                    <button mat-button>
                        <mat-icon color="primary">arrow_back</mat-icon>
                    </button>
                    <h2 class="title">Flow Bar layout</h2>
                </div>
        </mad-content-header>
        <mad-flowbar #flowBar [steps]="steps" [activeStep]="activeStep" (activeStepChange)="activeStepChanged($event)"
        (headerClick)="selectStep($event)">
        </mad-flowbar>
        <mad-content-panel-container>
            <mad-content-panel-container-content>
            <p *ngFor="let a of [1, 2, 3]">
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut
                labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et
                ea rebum.
                Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit
                amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna
                aliquyam
                erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd
                gubergren,
                no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
                sadipscing
                elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
                voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea
                takimata sanctus
                est
                Lorem ipsum dolor sit amet.
            </p>
            </mad-content-panel-container-content>
            <mad-content-panel-container-footer fxLayoutAlign="space-between center">
                <div fxLayout="row" fxLayoutGap="1em">
                    <mad-outline-button (click)="flowBar.previous()" *ngIf="flowBar.isPreviousAvailable()">
                        Previous
                    </mad-outline-button>
                    <mad-primary-button(click)="flowbar.next()" *ngIf="!flowBar.isLastStep()">
                        Next
                    </mad-primary-button>
                </div>
            </mad-content-panel-container-footer>
        </mad-content-panel-container>
    </mad-main-container>`;
}
