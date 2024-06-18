import { Component } from '@angular/core';
import { advancedSidebarLayout, advancedSidebarWithDefaultHeaderLayout, sidebarPageLayout } from '../layout-example-template';
import { CodeSnippetComponent } from '../../../components/code-snippet/code-snippet.component';
import { RouterLink } from '@angular/router';
import { ButtonModule } from '@porscheinformatik/material-addons';

@Component({
  selector: 'sidebar-page-layouts',
  templateUrl: './sidebar-page-layout.component.html',
  standalone: true,
  imports: [ButtonModule, RouterLink, CodeSnippetComponent],
})
export class SidebarPageLayoutComponent {
  sidebarPageLayout = sidebarPageLayout;
  advancedSidebarLayout = advancedSidebarLayout;
  advancedSidebarWithDefaultHeaderLayout = advancedSidebarWithDefaultHeaderLayout;
}
