import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SidebarLayoutComponent, ButtonModule, SidebarModule } from '@porscheinformatik/material-addons';

@Component({
    selector: 'app-advanced-sidebar-page-layout',
    templateUrl: './advanced-sidebar-page-layout.component.html',
    styleUrl: './advanced-sidebar-page-layout.component.scss',
    imports: [
        SidebarLayoutComponent,
        MatButtonModule,
        MatIconModule,
        ButtonModule,
        SidebarModule,
        RouterLink,
        RouterLinkActive,
        RouterOutlet,
    ]
})
export class AdvancedSidebarPageLayoutComponent {}
