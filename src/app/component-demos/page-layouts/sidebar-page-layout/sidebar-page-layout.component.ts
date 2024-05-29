import { Component } from '@angular/core';
import { advancedSidebarLayout, advancedSidebarWithDefaultHeaderLayout, sidebarPageLayout } from '../layout-example-template';

@Component({
  selector: 'sidebar-page-layouts',
  templateUrl: './sidebar-page-layout.component.html',
})
export class SidebarPageLayoutComponent {
  sidebarPageLayout = sidebarPageLayout;
  advancedSidebarLayout = advancedSidebarLayout;
  advancedSidebarWithDefaultHeaderLayout = advancedSidebarWithDefaultHeaderLayout;
}
