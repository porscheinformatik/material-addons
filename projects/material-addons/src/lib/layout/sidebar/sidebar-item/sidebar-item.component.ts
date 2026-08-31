import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: '[mad-sidebar-item]',
  templateUrl: 'sidebar-item.component.html',
  styleUrls: ['sidebar-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class SidebarItemComponent {}
