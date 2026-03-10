import { Component, inject, OnInit } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { VersionService } from './services/version.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  private themeService = inject(ThemeService);
  private versionService = inject(VersionService);

  ngOnInit(): void {
    this.themeService.init();
    this.versionService.loadManifest();
  }
}
