import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-settings',
  standalone: true,
  templateUrl: './settings-component.html',
  styleUrls: ['./settings-component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    NgIf
  ]
})
export class SettingsComponent implements OnInit {
  loading = true;

  settings = {
    darkMode: false,
    notifications: true,
    password: '',
    theme: 'default'
  };

  customColors = {
    primary: '#3f51b5',
    accent: '#ff4081',
    background: '#ffffff'
  };

  ngOnInit() {
    this.loadPreferences();
    setTimeout(() => (this.loading = false), 1000);
  }

  loadPreferences() {
    const savedTheme = localStorage.getItem('theme');
    const savedColors = localStorage.getItem('customColors');
    const savedDarkMode = localStorage.getItem('darkMode');

    if (savedTheme) this.settings.theme = savedTheme;
    if (savedColors) this.customColors = JSON.parse(savedColors);
    if (savedDarkMode === 'true') this.settings.darkMode = true;

    this.applyTheme();
  }

  toggleDarkMode() {
    this.settings.darkMode
      ? document.body.classList.add('dark-mode')
      : document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', String(this.settings.darkMode));
  }

  applyTheme() {
    document.body.removeAttribute('style');
    localStorage.setItem('theme', this.settings.theme);

    switch (this.settings.theme) {
      case 'blue':
        this.setTheme('#1976d2', '#90caf9', '#e3f2fd');
        break;
      case 'green':
        this.setTheme('#388e3c', '#a5d6a7', '#e8f5e9');
        break;
      case 'custom':
        this.applyCustomTheme();
        break;
      default:
        this.setTheme('#3f51b5', '#ff4081', '#ffffff');
        break;
    }
  }

  setTheme(primary: string, accent: string, background: string) {
    document.body.style.setProperty('--primary-color', primary);
    document.body.style.setProperty('--accent-color', accent);
    document.body.style.setProperty('--background-color', background);
  }

  applyCustomTheme() {
    this.setTheme(
      this.customColors.primary,
      this.customColors.accent,
      this.customColors.background
    );
    localStorage.setItem('customColors', JSON.stringify(this.customColors));
  }

  saveSettings() {
    localStorage.setItem('theme', this.settings.theme);
    localStorage.setItem('darkMode', String(this.settings.darkMode));
    localStorage.setItem('customColors', JSON.stringify(this.customColors));
    alert('✅ Settings saved successfully!');
  }
}
