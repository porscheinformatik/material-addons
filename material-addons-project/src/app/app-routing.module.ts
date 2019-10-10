import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IntroComponent } from './intro/intro.component';
import { TableDemoComponent } from './table-demo/table-demo.component';
import { DetailComponent } from './table-demo/detail/detail.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: 'intro',
    component: IntroComponent,
    pathMatch: 'full',
    data: {
      i18n: 'intro',
    }
  },
  {
    path: 'tableDemo',
    component: TableDemoComponent,
    pathMatch: 'full',
    data: {
      i18n: 'demos.tableDemo',
    }
  },
  {
    path: 'tableDemo/new',
    component: DetailComponent,
    data: {
      i18n: 'demos.tableDemoCreate'
    }
  },
  {
    path: 'tableDemo/:demoId',
    component: DetailComponent,
    data: {
      i18n: 'demos.tableDemoEdit'
    }
  },

  {
    path: 'home',
    component: HomeComponent,
    pathMatch: 'full'
  },
  { path: '**', redirectTo: 'intro' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
