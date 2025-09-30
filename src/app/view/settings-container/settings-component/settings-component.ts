import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common'; 

@Component({
  selector: 'app-settings',
  templateUrl: './settings-component.html',
  styleUrls: ['./settings-component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule
  ]
})
export class SettingsComponent implements OnInit {
  loading = true;

  settings = {
    darkMode: false,
    notifications: true,
    password: ''
  };

  ngOnInit() {
    
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      this.settings.darkMode = true;
      document.body.classList.add('dark-mode');
    }

   
    setTimeout(() => {
      this.loading = false;
    }, 1500);
  }

  toggleDarkMode() {
    if (this.settings.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    
    localStorage.setItem('darkMode', this.settings.darkMode.toString());
  }

  saveSettings() {
    alert('Settings saved successfully!');
  }
}
