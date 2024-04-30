import { Component } from '@angular/core';

@Component({
  selector: 'sidebar-page-layouts',
  templateUrl: './sidebar-page-layout.component.html',
})
export class SidebarPageLayoutComponent {
  sidebarPageLayout = `
<mad-main-container>
  <mad-content-header>
    <div class="flex-row align-items-center place-content-center-space-between">
      <div class="flex-row align-items-center place-content-center fx-gap-1em">
        <button mat-button>
          <mat-icon color="primary" (click)="goToPreviousPage()">arrow_back</mat-icon>
        </button>
        <h2 class="title">Sidebar layout</h2>
      </div>
      <div class="flex-row align-items-center place-content-center fx-gap-1em">
        <mad-icon-button>
          <mat-icon color="primary">history</mat-icon>
        </mad-icon-button>
        <mad-outline-button>Action A</mad-outline-button>
        <mad-outline-button color="warn">Action B</mad-outline-button>
      </div>
    </div>
  </mad-content-header>
  <mad-content-panel-container>
    <mad-content-panel-container-sidebar>
      <mad-sidebar>
        <a mad-sidebar-item routerLink="/full-page-layouts/sidebar-page-layout/1" routerLinkActive="active-sidebar-item">Item 1</a>
        <a mad-sidebar-item routerLink="/full-page-layouts/sidebar-page-layout/2" routerLinkActive="active-sidebar-item">Item 2</a>
      </mad-sidebar>
    </mad-content-panel-container-sidebar>
    <mad-content-panel-container-content>
      <router-outlet></router-outlet>
    </mad-content-panel-container-content>
  </mad-content-panel-container>
</mad-main-container>`;

  advancedSidebarLayout = `
<mad-sidebar-layout
  [sideBarItems]="sideBarItems"
  [content]="content"
  [headerContent]="headerContent">
  <ng-template #headerContent>
    <div class="flex-row align-items-center place-content-center-space-between">
      <div class="flex-row align-items-center place-content-center fx-gap-1em back-and-title">
        <button mat-button>
          <mat-icon color="primary">arrow_back</mat-icon>
        </button>
        <h2 class="title">Advanced Sidebar layout</h2>
      </div>
      <div class="flex-row align-items-center place-content-center fx-gap-1em">
        <mad-icon-button>
          <mat-icon color="primary">history</mat-icon>
        </mad-icon-button>
        <mad-outline-button>Action A</mad-outline-button>
        <mad-outline-button color="warn">Action B</mad-outline-button>
      </div>
    </div>
  </ng-template>
  <ng-template #sideBarItems>
    <mad-sidebar>
      <a mad-sidebar-item routerLink="/full-page-layouts/advanced-sidebar-page-layout/1"
         routerLinkActive="active-sidebar-item">Item 1</a>
      <a mad-sidebar-item routerLink="/full-page-layouts/advanced-sidebar-page-layout/2"
         routerLinkActive="active-sidebar-item">Item 2</a>
    </mad-sidebar>
  </ng-template>
  <ng-template #content>
    <router-outlet></router-outlet>
  </ng-template>
</mad-sidebar-layout>
`;

  advancedSidebarWithDefaultHeaderLayout = `
<mad-sidebar-layout
  [sideBarItems]="sideBarItems"
  [content]="content"
  title="Advanced Sidebar Layout With Default Header"
  [actionGroup]="actionGroup">
  <ng-template #actionGroup>
    <mad-button-group>
      <mad-outline-button>Test</mad-outline-button>
      <a color="primary" mat-icon-button title="Action 1">
        <mat-icon>exit_to_app</mat-icon>
      </a>
      <a color="primary" mat-icon-button title="Action 2">
        <mat-icon class="material-icons-outlined">help_center</mat-icon>
      </a>
      <a color="primary" mat-icon-button title="Action 3">
        <mat-icon class="material-icons-outlined">payments</mat-icon>
      </a>
    </mad-button-group>
  </ng-template>
  <ng-template #sideBarItems>
    <mad-sidebar>
      <a mad-sidebar-item routerLink="/full-page-layouts/advanced-sidebar-with-default-header-page-layout/1"
         routerLinkActive="active-sidebar-item">Item 1</a>
      <a mad-sidebar-item routerLink="/full-page-layouts/advanced-sidebar-with-default-header-page-layout/2"
         routerLinkActive="active-sidebar-item">Item 2</a>
    </mad-sidebar>
  </ng-template>
  <ng-template #content>
    <router-outlet></router-outlet>
  </ng-template>
</mad-sidebar-layout>
`;
}
