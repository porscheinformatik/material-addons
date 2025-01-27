import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
    selector: 'app-full-page-layouts',
    templateUrl: './full-page-layouts.component.html',
    styleUrls: ['./full-page-layouts.component.scss'],
    imports: [MatToolbarModule, RouterLink, MatButtonModule, MatMenuModule, MatIconModule, RouterOutlet]
})
export class FullPageLayoutsComponent {}
