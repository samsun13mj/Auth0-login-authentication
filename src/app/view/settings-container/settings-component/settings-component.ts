import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { ThemeService, AppTheme } from '../../../service/theme-service';

/** ✅ Explicit preset keys */
type PresetKey = 'default' | 'ocean' | 'gold';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatSlideToggleModule
  ],
  templateUrl: './settings-component.html',
  styleUrls: ['./settings-component.scss']
})
export class SettingsComponent {

  darkMode = localStorage.getItem('dark-mode') === 'true';

  /** ✅ Typed presets (NO index signature issue) */
  presets: Record<PresetKey, AppTheme> = {
    default: {
      primary: '#3B82F6',
      accent: '#9333EA',
      background: '#ffffff',
      highlight: '#2563eb'
    },
    ocean: {
      primary: '#0284C7',
      accent: '#0EA5E9',
      background: '#E0F2FE',
      highlight: '#0369A1'
    },
    gold: {
      primary: '#EAB308',
      accent: '#FACC15',
      background: '#FEFCE8',
      highlight: '#CA8A04'
    }
  };

  /** ✅ Safe access */
  customTheme: AppTheme = { ...this.presets['default'] };

  constructor(private themeService: ThemeService) {}

  applyPreset(key: PresetKey): void {
    this.themeService.setTheme(this.presets[key]);
  }

  applyCustom(): void {
    this.themeService.setTheme(this.customTheme);
  }

  toggleDark(): void {
    this.themeService.toggleDarkMode(this.darkMode);
  }
}
