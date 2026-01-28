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
  accent: '#3B82F6',
  background: '#ffffff',
  highlight: '#2563eb'
};

@Injectable({ providedIn: 'root' })
export class ThemeService {

  private themeSubject = new BehaviorSubject<AppTheme>(
    this.loadTheme()
  );

  theme$ = this.themeSubject.asObservable();

  constructor() {} // ❌ NO side effects here

  /**  CALLED BY APP_INITIALIZER */
  init(): void {
    const theme = this.loadTheme();
    this.themeSubject.next(theme);
    this.applyTheme(theme);
    this.restoreDarkMode();
  }

  setTheme(theme: AppTheme): void {
    this.themeSubject.next(theme);
    localStorage.setItem('app-theme', JSON.stringify(theme));
    this.applyTheme(theme);
  }

  toggleDarkMode(enabled: boolean): void {
    document.body.classList.toggle('dark-mode', enabled);
    localStorage.setItem('dark-mode', String(enabled));
  }

  private restoreDarkMode(): void {
    const enabled = localStorage.getItem('dark-mode') === 'true';
    document.body.classList.toggle('dark-mode', enabled);
  }

  private applyTheme(theme: AppTheme): void {
    const root = document.documentElement;

    /* App tokens */
    root.style.setProperty('--app-primary', theme.primary);
    root.style.setProperty('--app-accent', theme.accent);
    root.style.setProperty('--app-background', theme.background);
    root.style.setProperty('--app-highlight', theme.highlight);

    /* Material M3 bridge */
    root.style.setProperty('--mat-sys-primary', theme.primary);
    root.style.setProperty('--mat-sys-secondary', theme.accent);
    root.style.setProperty('--mat-sys-background', theme.background);
    root.style.setProperty('--mat-sys-surface', theme.background);
    root.style.setProperty('--mat-sys-surface-container', theme.background);
    root.style.setProperty('--mat-sys-surface-container-high', theme.background);
    root.style.setProperty('--mat-sys-surface-container-low', theme.background);
    root.style.setProperty('--mat-sys-on-primary', '#ffffff');
    root.style.setProperty('--mat-sys-on-surface', '#111827');
  }

  private loadTheme(): AppTheme {
    const saved = localStorage.getItem('app-theme');
    return saved ? JSON.parse(saved) : DEFAULT_THEME;
  }
}
