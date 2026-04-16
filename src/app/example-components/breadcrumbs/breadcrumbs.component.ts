import { Component } from '@angular/core';
import { BreadcrumbComponent, BreadcrumbItem } from '@porscheinformatik/material-addons';

@Component({
  selector: 'app-breadcrumbs',
  imports: [BreadcrumbComponent],
  templateUrl: './breadcrumbs.component.html',
})
export class BreadcrumbsComponent {
  breadcrumbs: BreadcrumbItem[] = [{ label: 'Home', href: '/' }, { label: 'User', href: '/' }, { label: 'Details' }];

  copied() {
    alert('Copied!');
  }
}
