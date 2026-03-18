import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DemoVersion {
  id: string;
  label: string;
  description?: string;
  url: string;
  baseHref: string;
}

interface VersionManifest {
  versions: DemoVersion[];
}

@Injectable({ providedIn: 'root' })
export class VersionService {
  readonly currentVersionId = environment.currentVersionId;
  readonly versions: Signal<DemoVersion[]> = computed(() => this.versionsSignal());
  readonly currentVersion: Signal<DemoVersion | undefined> = computed(() =>
    this.versionsSignal().find((version) => version.id === this.currentVersionId),
  );

  private readonly http = inject(HttpClient);
  private readonly manifestPath = 'assets/version-manifest.json';
  private readonly versionsSignal = signal<DemoVersion[]>([]);
  private loaded = false;

  loadManifest(): void {
    if (this.loaded) {
      return;
    }
    this.loaded = true;
    this.http
      .get<VersionManifest>(this.manifestPath)
      .pipe(
        catchError(() => {
          console.error('Failed to load version manifest');
          return of({ versions: [] });
        }),
      )
      .subscribe((manifest) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this.versionsSignal.set(manifest?.versions ?? []);
      });
  }

  isCurrentVersion(version: DemoVersion): boolean {
    return version.id === this.currentVersionId;
  }

  navigateTo(version: DemoVersion): void {
    if (!version || this.isCurrentVersion(version)) {
      return;
    }
    window.location.href = version.url;
  }
}
