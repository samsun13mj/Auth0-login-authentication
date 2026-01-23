import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';          
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile-component.html',
  styleUrls: ['./profile-component.scss'],
  imports: [
    CommonModule,            
    MatCardModule,
    MatProgressSpinnerModule,
    NgIf
  ]
})
export class ProfileComponent implements OnInit {
  loading = true;

  user = {
    profilePic: 'https://via.placeholder.com/120',
    name: 'Luffy',
    age: 23,
    job: 'Web Developer',
    email: 'luffy@example.com',
    location: 'Bangalore, India',
    about: 'Passionate web developer with 3 years of experience in Angular and modern web technologies.',
    skills: ['Angular', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Node.js'],
    activities: [
      'Updated project dashboard',
      'Fixed a bug in authentication module',
      'Pushed code to GitHub repo',
      'Reviewed PRs from team'
    ]
  };

  ngOnInit(): void {
    const savedPic = localStorage.getItem('profilePic');
    if (savedPic) {
      this.user.profilePic = savedPic;
    }

    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.user.profilePic = reader.result as string;
        localStorage.setItem('profilePic', this.user.profilePic);
      };

      reader.readAsDataURL(file);
    }
  }
}
