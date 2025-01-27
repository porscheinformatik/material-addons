import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@porscheinformatik/material-addons';

@Component({
    selector: 'example-header',
    imports: [
        CommonModule,
        MatIconModule,
        MatListModule,
        MatMenuModule,
        MatToolbarModule,
        RouterLink,
        RouterLinkActive,
        TranslateModule,
        ButtonModule,
    ],
    templateUrl: './example-header.component.html',
    styleUrl: './example-header.component.scss'
})
export class ExampleHeaderComponent {
  navLinks = [
    { path: '/documentation', label: 'Documentation' },
    { path: '/news', label: 'News' },
  ];
}
