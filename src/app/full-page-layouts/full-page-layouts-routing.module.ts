import { FullPageLayoutsComponent } from './full-page-layouts.component';
import { BasePageLayoutComponent } from './base-page-layout/base-page-layout.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { FlowbarPageLayoutComponent } from './flowbar-page-layout/flowbar-page-layout.component';

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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FullPageLayoutsRoutingModule {}
