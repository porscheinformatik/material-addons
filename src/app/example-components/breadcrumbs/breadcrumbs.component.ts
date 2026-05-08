import { Component } from '@angular/core';
import { BreadcrumbComponent, BreadcrumbItem } from '@porscheinformatik/material-addons';

@Component({
  selector: 'app-breadcrumbs',
  imports: [BreadcrumbComponent],
  templateUrl: './breadcrumbs.component.html',
})
export class BreadcrumbsComponent {
  readonly orderBreadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', route: ['/'] },
    { label: 'Orders', route: ['/documentation/card'] },
    { label: 'Order details' },
  ];

  readonly documentationBreadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', route: ['/'] },
    { label: 'External documentation', href: 'https://material.angular.io/' },
    { label: 'Breadcrumb' },
  ];

  copied(): void {
    alert('Breadcrumb copied');
  }
}
