import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IntroComponent } from './intro/intro.component';
import { TableDemoComponent } from './demos/table-demo/table-demo.component';
import { DetailComponent } from './demos/table-demo/detail/detail.component';
import { HomeComponent } from './home/home.component';
import { ReadOnlyDemoComponent } from './component-demos/read-only-demo/read-only-demo.component';
import { InternationalizationComponent } from './internationalization/internationalization.component';
import { ToolbarDemoComponent } from './component-demos/toolbar-demo/toolbar-demo.component';
import { ActionButtonDemoComponent } from './component-demos/action-button-demo/action-button-demo.component';
import { NumericFieldDemoComponent } from './component-demos/numeric-field-demo/numeric-field-demo.component';

const routes: Routes = [
  {
    path: 'intro',
    component: IntroComponent,
    pathMatch: 'full',
    data: {
      i18n: 'intro.title',
    },
  },
  {
    path: 'internationalization',
    component: InternationalizationComponent,
    pathMatch: 'full',
    data: {
      i18n: 'internationalization.title',
    },
  },
  {
    path: 'tableDemo',
    component: TableDemoComponent,
    pathMatch: 'full',
    data: {
      i18n: 'demos.tableDemo',
    },
  },
  {
    path: 'tableDemo/new',
    component: DetailComponent,
    data: {
      i18n: 'demos.tableDemoCreate',
    },
  },
  {
    path: 'tableDemo/:demoId',
    component: DetailComponent,
    data: {
      i18n: 'demos.tableDemoEdit',
    },
  },
  {
    path: 'readonly',
    component: ReadOnlyDemoComponent,
    pathMatch: 'full',
    data: {
      i18n: 'components.demos.readonly',
    },
  },
  {
    path: 'numeric-field',
    component: NumericFieldDemoComponent,
    pathMatch: 'full',
    data: {
      i18n: 'components.demos.numeric-field',
    },
  },
  {
    path: 'toolbar',
    component: ToolbarDemoComponent,
    pathMatch: 'full',
    data: {
      i18n: 'components.demos.toolbar',
    },
  },
  {
    path: 'action-button',
    component: ActionButtonDemoComponent,
    pathMatch: 'full',
    data: {
      i18n: 'components.demos.action-button',
    },
  },

  {
    path: 'home',
    component: HomeComponent,
    pathMatch: 'full',
  },
  { path: '**', redirectTo: 'intro' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
