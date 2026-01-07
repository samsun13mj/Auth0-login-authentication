import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AppTheme {
  primary: string;
  accent: string;
  background: string;
  highlight: string;
}

const DEFAULT_THEME: AppTheme = {
  primary: '#3B82F6',
  accent: '#9333EA',
  background: '#ffffff',
  highlight: '#2563eb'
};

@Injectable({ providedIn: 'root' })
export class ThemeService {

  private themeSubject = new BehaviorSubject<AppTheme>(
    this.loadTheme()
  );

  theme$ = this.themeSubject.asObservable();

  constructor() {
    this.applyTheme(this.themeSubject.value);
    this.restoreDarkMode();
  }

  setTheme(theme: AppTheme): void {
    this.themeSubject.next(theme);
    localStorage.setItem('app-theme', JSON.stringify(theme));
    this.applyTheme(theme);
  }

  private applyTheme(theme: AppTheme): void {
    const root = document.documentElement;

    root.style.setProperty('--app-primary', theme.primary);
    root.style.setProperty('--app-accent', theme.accent);
    root.style.setProperty('--app-background', theme.background);
    root.style.setProperty('--app-highlight', theme.highlight);

    /* Material M3 bridge */
    root.style.setProperty('--mat-sys-primary', theme.primary);
    root.style.setProperty('--mat-sys-secondary', theme.accent);
    root.style.setProperty('--mat-sys-background', theme.background);
    root.style.setProperty('--mat-sys-surface', theme.background);
  }

  toggleDarkMode(enabled: boolean): void {
    document.body.classList.toggle('dark-mode', enabled);
    localStorage.setItem('dark-mode', String(enabled));
  }

  private restoreDarkMode(): void {
    const enabled = localStorage.getItem('dark-mode') === 'true';
    document.body.classList.toggle('dark-mode', enabled);
  }

  private loadTheme(): AppTheme {
    const saved = localStorage.getItem('app-theme');
    return saved ? JSON.parse(saved) : DEFAULT_THEME;
  }
}
