import { Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@porscheinformatik/material-addons';
import { ThemeService, ThemeName } from '../../services/theme.service';
import { DemoVersion, VersionService } from '../../services/version.service';

@Component({
  selector: 'example-header',
  imports: [MatButtonModule, MatIconModule, MatListModule, MatMenuModule, MatToolbarModule, RouterLink, RouterLinkActive, TranslateModule, ButtonModule],
  templateUrl: './example-header.component.html',
  styleUrl: './example-header.component.scss',
})
export class ExampleHeaderComponent {
  private themeService = inject(ThemeService);
  private versionService = inject(VersionService);
  activeTheme = this.themeService.activeTheme;
  versions = this.versionService.versions;
  currentVersion = this.versionService.currentVersion;

  navLinks = [
    { path: '/documentation', label: 'Documentation' },
    { path: '/news', label: 'News' },
  ];

  switchTheme(name: ThemeName): void {
    this.themeService.switchTheme(name);
  }

  switchVersion(version: DemoVersion): void {
    this.versionService.navigateTo(version);
  }

  isCurrentVersion(version: DemoVersion): boolean {
    return this.versionService.isCurrentVersion(version);
  }
}
