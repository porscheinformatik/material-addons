import { Component } from '@angular/core';
import { flowBarLayout } from '../layout-example-template';

@Component({
  selector: 'flowbar-page-layout',
  templateUrl: './flowbar-page-layout.component.html',
})
export class FlowbarPageLayoutComponent {
  flowBarLayout = flowBarLayout;
}
