import { Component } from '@angular/core';
import { basePageLayout } from '../layout-example-template';

@Component({
  selector: 'base-page-layout',
  templateUrl: './base-page-layout.component.html',
})
export class BasePageLayoutComponent {
  basePageLayout = basePageLayout;
}
