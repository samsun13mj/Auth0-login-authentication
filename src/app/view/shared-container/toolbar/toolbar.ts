import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../service/auth-service';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './toolbar.html',
  styleUrls: ['./toolbar.scss']
})
export class ToolbarComponent {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  // ✅ CORRECT MENU CLOSE
  goToProfile(trigger: MatMenuTrigger) {
  trigger.closeMenu();
  this.router.navigate(['/app/profile']);
}


  logout() {
    this.authService.logout()
      .then(() => this.router.navigate(['/login']))
      .catch(err => console.error('Logout failed:', err));
  }
}
