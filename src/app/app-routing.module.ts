import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntroComponent } from './intro/intro.component';
import { HomeComponent } from './home/home.component';
import { ReadOnlyDemoComponent } from './component-demos/read-only-demo/read-only-demo.component';
import { InternationalizationComponent } from './internationalization/internationalization.component';
import { ToolbarDemoComponent } from './component-demos/toolbar-demo/toolbar-demo.component';
import { ActionButtonDemoComponent } from './component-demos/action-button-demo/action-button-demo.component';
import { NumericFieldDemoComponent } from './component-demos/numeric-field-demo/numeric-field-demo.component';
import { CardDemoComponent } from './component-demos/card-demo/card-demo.component';
import { QuickListDemoComponent } from './component-demos/quick-list-demo/quick-list-demo.component';
import { TableDemoComponent } from './component-demos/table-demo/table-demo.component';
import { MadButtonsDemoComponent } from './component-demos/mad-buttons-demo/mad-buttons-demo.component';
import { ThrottleClickDemoComponent } from './component-demos/throttle-click-demo/throttle-click-demo.component';
import { StepperDemoComponent } from './component-demos/stepper-demo/stepper-demo.component';
import { BasePageLayoutComponent } from './component-demos/page-layouts/base-page-layout/base-page-layout.component';
import { FlowbarPageLayoutComponent } from './component-demos/page-layouts/flowbar-page-layout/flowbar-page-layout.component';
import { SidebarPageLayoutComponent } from './component-demos/page-layouts/sidebar-page-layout/sidebar-page-layout.component';
import { ExampleComponentsLayoutComponent } from './example-components-layout/example-components-layout.component';
import { DataTableDemoComponent } from './component-demos/data-table-demo/data-table-demo.component';
import { UploadDemoComponent } from './component-demos/upload-demo/upload-demo.component';
import { NewsComponent } from './news/news.component';
import { AlertDemoComponent } from './component-demos/alert-demo/alert-demo.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'documentation',
    component: ExampleComponentsLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'intro',
        pathMatch: 'full',
      },
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
        path: 'card',
        component: CardDemoComponent,
        pathMatch: 'full',
        data: {
          i18n: 'components.demos.card',
        },
      },
      {
        path: 'quick-list',
        component: QuickListDemoComponent,
        pathMatch: 'full',
        data: {
          i18n: 'components.demos.quick-list',
        },
      },
      {
        path: 'alert',
        component: AlertDemoComponent,
        pathMatch: 'full',
        data: {
          i18n: 'components.demos.alert',
        },
      },
      {
        path: 'mad-buttons',
        component: MadButtonsDemoComponent,
        pathMatch: 'full',
        data: {
          i18n: 'components.demos.buttons',
        },
      },
      {
        path: 'table',
        component: TableDemoComponent,
        pathMatch: 'full',
        data: {
          i18n: 'components.demos.table',
        },
      },
      {
        path: 'data-table',
        component: DataTableDemoComponent,
        pathMatch: 'full',
        data: {
          i18n: 'components.demos.data-table',
        },
      },
      {
        path: 'stepper',
        component: StepperDemoComponent,
        pathMatch: 'full',
        data: {
          i18n: 'components.demos.stepper',
        },
      },
      {
        path: 'upload',
        component: UploadDemoComponent,
        pathMatch: 'full',
        data: {
          i18n: 'components.demos.upload',
        },
      },
      {
        path: 'throttle-click',
        component: ThrottleClickDemoComponent,
        pathMatch: 'full',
        data: {
          i18n: 'directives.demos.throttle-click',
        },
      },
      {
        path: 'base-page-layout',
        component: BasePageLayoutComponent,
        pathMatch: 'full',
        data: {
          i18n: 'layouts.demos.base-page-layout',
        },
      },
      {
        path: 'flowbar-page-layout',
        component: FlowbarPageLayoutComponent,
        pathMatch: 'full',
        data: {
          i18n: 'layouts.demos.flowbar-page-layout',
        },
      },
      {
        path: 'sidebar-page-layout',
        component: SidebarPageLayoutComponent,
        pathMatch: 'full',
        data: {
          i18n: 'layouts.demos.sidebar-page-layout',
        },
      },
    ],
  },
  {
    path: 'news',
    component: NewsComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
