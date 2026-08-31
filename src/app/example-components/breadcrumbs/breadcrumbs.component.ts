import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BreadcrumbComponent, BreadcrumbItem } from '@porscheinformatik/material-addons';

@Component({
  selector: 'app-breadcrumbs',
  imports: [BreadcrumbComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './breadcrumbs.component.html',
})
export class BreadcrumbsComponent {
  breadcrumbs: BreadcrumbItem[] = [{ label: 'Home', href: '/' }, { label: 'User', href: '/' }, { label: 'Details' }];

  copied() {
    alert('Copied!');
  }
}
