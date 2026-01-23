import { Component, Input } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-details-sidenav',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, NgIf],
  templateUrl: './user-details.html',
  styleUrls: ['./user-details.scss']
})
export class UserDetailsSidenavComponent {
  @Input() user: any = null;
  get displayName() {
    if (!this.user) return 'Unknown';
    return this.user.name || this.user.fullName || this.user.username || this.user.email || 'User';
  }
}
