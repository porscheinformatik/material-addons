import { Component, inject, OnInit } from '@angular/core';
import { VersionService } from './services/version.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  private versionService = inject(VersionService);

  ngOnInit() {
    this.versionService.loadManifest();
  }
}
