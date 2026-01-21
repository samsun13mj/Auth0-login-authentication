import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

import { NotificationService } from '../../../service/notification-container/notification-service';
import { AuthService } from '@auth0/auth0-angular'; // ✅ FIXED

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
export class ToolbarComponent implements OnInit {

  notifications: any[] = [];
  unreadCount = 0;

  constructor(
    private notify: NotificationService,
    private router: Router,
    private auth: AuthService   // ✅ AUTH0
  ) {}

  ngOnInit(): void {
    this.notify.notifications$.subscribe(res => {
      this.notifications = res;
    });

    this.notify.unreadCount$.subscribe(count => {
      this.unreadCount = count;
    });

    this.notify.load();
  }

  openNotification(n: any): void {
    if (!n.read) {
      this.notify.markAsRead(n.id).subscribe();
    }

    this.router.navigate(['/app/notifications']);
  }

  logout() {
    this.auth.logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  }
}
