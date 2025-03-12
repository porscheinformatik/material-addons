import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SidebarLayoutComponent, ButtonModule, SidebarModule } from '@porscheinformatik/material-addons';

@Component({
  selector: 'app-advanced-sidebar-with-default-header-page-layout',
  templateUrl: './advanced-sidebar-with-default-header-page-layout.component.html',
  styleUrl: './advanced-sidebar-with-default-header-page-layout.component.scss',
  imports: [
    SidebarLayoutComponent,
    ButtonModule,
    MatButtonModule,
    MatIconModule,
    SidebarModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
})
export class AdvancedSidebarWithDefaultHeaderPageLayoutComponent {}
