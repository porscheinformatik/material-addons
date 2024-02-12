import { Component } from '@angular/core';

@Component({
  selector: 'base-page-layout',
  templateUrl: './base-page-layout.component.html',
})
export class BasePageLayoutComponent {
  basePageLayout = `<mad-main-container>
        <mad-content-header>
          <div class="fx fx-row fx-space-between fx-align-center">
            <div class="fx fx-row fx-align-center fx-gap-1em">
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
          <mad-content-panel-container-footer class="fx fx-space-between fx-align-center">
            <p>Footer here</p>
          </mad-content-panel-container-footer>
       </mad-content-panel-container>
     </mad-main-container>`;
}
