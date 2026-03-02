import { Injectable, signal } from '@angular/core';

export type ThemeName = 'carcat' | 'pbv' | 'poa';

const STORAGE_KEY = 'mad-theme';
const LINK_ID = 'app-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly availableThemes: ThemeName[] = ['carcat', 'pbv', 'poa'];
  readonly activeTheme = signal<ThemeName>('pbv');

  init(): void {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeName | null;
    const theme = stored && this.availableThemes.includes(stored) ? stored : 'pbv';
    this.applyTheme(theme);
  }

  switchTheme(name: ThemeName): void {
    this.applyTheme(name);
    localStorage.setItem(STORAGE_KEY, name);
  }

  private applyTheme(name: ThemeName): void {
    this.activeTheme.set(name);
    const existing = document.getElementById(LINK_ID);
    if (existing) {
      existing.remove();
    }
    const link = document.createElement('link');
    link.id = LINK_ID;
    link.rel = 'stylesheet';
    link.href = `theme-${name}.css`;
    document.head.appendChild(link);
  }
}
