import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

import { NotificationService } from '../../../service/notification-container/notification-service';
import { AuthService } from '@auth0/auth0-angular';

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

  userName = '';
  userEmail = '';
  userPicture = '';
  userLetter = '';
  hasRealPicture = false;

  constructor(
    private notify: NotificationService,
    private router: Router,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.auth.user$.subscribe(user => {
      if (user) {

        //  Show name before @gmail.com
        this.userName = user.email
          ? user.email.split('@')[0]
          : user.name || 'User';

        //  Email
        this.userEmail = user.email || '';

        const picture = user.picture || '';

        //  Google profile photo
        if (picture.includes('googleusercontent')) {
          this.userPicture = picture.replace('s96-c', 's400-c');
          this.hasRealPicture = true;
        }
        //  Gravatar real photo
        else if (picture.includes('gravatar') && !picture.includes('d=')) {
          this.userPicture = picture;
          this.hasRealPicture = true;
        }
        //  No photo → Gmail letter avatar
        else {
          this.hasRealPicture = false;
          this.userLetter = this.userName.charAt(0).toUpperCase();
        }
      }
    });

    //  Notifications
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

  login() {
    this.auth.loginWithRedirect();
  }

  logout() {
    this.auth.logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  }
}
