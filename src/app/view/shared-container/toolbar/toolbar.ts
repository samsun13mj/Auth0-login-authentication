import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

import { NotificationService } from '../../../service/notification-container/notification-service';
import { AuthService } from '@auth0/auth0-angular';
import { Subscription, interval } from 'rxjs';

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
export class ToolbarComponent implements OnInit, OnDestroy {

  notifications: any[] = [];
  unreadCount = 0;

  userName = '';
  userEmail = '';
  userPicture = '';
  userLetter = '';
  hasRealPicture = false;

  private subs = new Subscription(); // ✅ avoid memory leak

  constructor(
    private notify: NotificationService,
    private router: Router,
    public auth: AuthService
  ) {}

  ngOnInit(): void {

    // ================= AUTH USER =================
    const authSub = this.auth.user$.subscribe(user => {
      if (user) {

        this.userName = user.email
          ? user.email.split('@')[0]
          : user.name || 'User';

        this.userEmail = user.email || '';

        const picture = user.picture || '';

        if (picture.includes('googleusercontent')) {
          this.userPicture = picture.replace('s96-c', 's400-c');
          this.hasRealPicture = true;
        }
        else if (picture.includes('gravatar') && !picture.includes('d=')) {
          this.userPicture = picture;
          this.hasRealPicture = true;
        }
        else {
          this.hasRealPicture = false;
          this.userLetter = this.userName.charAt(0).toUpperCase();
        }
      }
    });

    this.subs.add(authSub);

    // ================= NOTIFICATIONS =================

    const notiSub = this.notify.notifications$.subscribe(res => {
      this.notifications = res;
      console.log('🔔 Notifications loaded:', res); // ✅ DEBUG
    });

    const unreadSub = this.notify.unreadCount$.subscribe(count => {
      this.unreadCount = count;
      console.log('🔔 Unread count:', count); // ✅ DEBUG
    });

    this.subs.add(notiSub);
    this.subs.add(unreadSub);

    // ✅ FIRST LOAD (IMPORTANT)
    this.notify.load();

    // ✅ AUTO REFRESH (json-server fix)
    const intervalSub = interval(2000).subscribe(() => {
      this.notify.load();
    });

    this.subs.add(intervalSub);
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

  ngOnDestroy(): void {
    this.subs.unsubscribe(); // ✅ cleanup
  }
}
