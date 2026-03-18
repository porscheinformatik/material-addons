import { Component, inject } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@porscheinformatik/material-addons';
import { DemoVersion, VersionService } from '../../services/version.service';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'example-header',
  imports: [
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatToolbarModule,
    RouterLink,
    RouterLinkActive,
    TranslateModule,
    ButtonModule,
    MatButton,
  ],
  templateUrl: './example-header.component.html',
  styleUrl: './example-header.component.scss',
})
export class ExampleHeaderComponent {
  versionService = inject(VersionService);
  versions = this.versionService.versions;
  currentVersion = this.versionService.currentVersion;

  navLinks = [
    { path: '/documentation', label: 'Documentation' },
    { path: '/news', label: 'News' },
  ];

  switchVersion(version: DemoVersion): void {
    this.versionService.navigateTo(version);
  }

  isCurrentVersion(version: DemoVersion): boolean {
    return this.versionService.isCurrentVersion(version);
  }
}
