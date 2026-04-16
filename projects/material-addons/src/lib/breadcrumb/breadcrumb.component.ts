import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconButtonComponent } from '../button/icon-button/icon-button.component';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

export interface BreadcrumbItem {
  label: string;
  route?: string[]; // Optional — undefined for current non-clickable item
  href?: string;
}

@Component({
  selector: 'mad-breadcrumb',
  imports: [RouterLink, IconButtonComponent, MatIcon, MatTooltip],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
})
export class BreadcrumbComponent {
  breadcrumbs = input.required<BreadcrumbItem[]>();
  showCopy = input<boolean>(false);
  title = input<string>('Copy');

  copy = output<void>();
}
