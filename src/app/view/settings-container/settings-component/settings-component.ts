import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { ThemeService, AppTheme } from '../../../service/theme-container/theme-service';

/**  Explicit preset keys */
type PresetKey =
  | 'default'
  | 'ocean'
  | 'gold'
  | 'cherry'
  | 'green'
  | 'orange'
  | 'purple'
  | 'teal'
  | 'indigo';

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

  presets: Record<PresetKey, AppTheme> = {
    default: {
      primary: '#3B82F6',
      accent: '#3B82F6',
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
    },
    cherry: {
      primary: '#E11D48',
      accent: '#FB7185',
      background: '#FFF1F2',
      highlight: '#BE123C'
    },
    green: {
      primary: '#16A34A',
      accent: '#4ADE80',
      background: '#ECFDF5',
      highlight: '#15803D'
    },
    orange: {
      primary: '#F97316',
      accent: '#FDBA74',
      background: '#FFF7ED',
      highlight: '#C2410C'
    },
    purple: {
      primary: '#7C3AED',
      accent: '#A78BFA',
      background: '#F5F3FF',
      highlight: '#5B21B6'
    },
    teal: {
      primary: '#0D9488',
      accent: '#2DD4BF',
      background: '#F0FDFA',
      highlight: '#115E59'
    },
    indigo: {
      primary: '#4338CA',
      accent: '#818CF8',
      background: '#EEF2FF',
      highlight: '#312E81'
    }
  };

  /**  Default custom theme */
  customTheme: AppTheme = { ...this.presets.default };

  constructor(private themeService: ThemeService) {}

  applyPreset(key: PresetKey): void {
    this.customTheme = { ...this.presets[key] };
    this.themeService.setTheme(this.presets[key]);
  }

  applyCustom(): void {
    this.themeService.setTheme(this.customTheme);
  }

  toggleDark(): void {
    this.themeService.toggleDarkMode(this.darkMode);
  }
}
