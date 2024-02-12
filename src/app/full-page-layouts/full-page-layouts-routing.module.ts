import { FullPageLayoutsComponent } from './full-page-layouts.component';
import { BasePageLayoutComponent } from './base-page-layout/base-page-layout.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { FlowbarPageLayoutComponent } from './flowbar-page-layout/flowbar-page-layout.component';
import { SidebarPageLayoutComponent } from './sidebar-page-layout/sidebar-page-layout.component';
import { ExamplePageOneComponent } from './example-page-one/example-page-one.component';
import { ExamplePageTwoComponent } from './example-page-two/example-page-two.component';

const routes: Routes = [
  {
    path: 'full-page-layouts',
    component: FullPageLayoutsComponent,
    children: [
      {
        path: 'base-page-layout',
        component: BasePageLayoutComponent,
      },
      {
        path: 'flowbar-page-layout',
        component: FlowbarPageLayoutComponent,
      },
      {
        path: 'sidebar-page-layout',
        component: SidebarPageLayoutComponent,
        children: [
          {
            path: '1',
            component: ExamplePageOneComponent,
          },
          {
            path: '2',
            component: ExamplePageTwoComponent,
          },
          {
            path: '**',
            redirectTo: '1',
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FullPageLayoutsRoutingModule {}
