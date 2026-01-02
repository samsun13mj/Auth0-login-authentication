import {
  Component,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

import { AuthService } from '@auth0/auth0-angular';

import { SidebarComponent } from '../../sidebar/sidebar';
import { UserDetailsSidenavComponent } from '../../../user-details-container/user-details/user-details';
import { SidenavService } from '../../../../service/sidenav-service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,

    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,

    SidebarComponent,
    UserDetailsSidenavComponent
  ],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.scss']
})
export class MainLayoutComponent
  implements AfterViewInit, OnDestroy {

  @ViewChild('userDetailsSidenav')
  userDetailsSidenav!: MatSidenav;

  private subs = new Subscription();
  _sidenavUser: any = null;

  constructor(
    private sidenavService: SidenavService,
    private auth: AuthService
  ) {}

  ngAfterViewInit(): void {

    /* 🔴 TEMP DEBUG — SEE JWT TOKEN */
    this.auth.getAccessTokenSilently().subscribe(token => {
      console.log('JWT ACCESS TOKEN:', token);
    });

    /* 🔴 TEMP DEBUG — SEE AUTH0 USER OBJECT */
    this.auth.user$.subscribe(user => {
      console.log('AUTH0 USER OBJECT:', user);
    });

    /* ✅ EXISTING CODE — DO NOT CHANGE */
    const s = this.sidenavService.payload$.subscribe(payload => {
      this._sidenavUser = payload.user || null;

      setTimeout(() => {
        payload.open
          ? this.userDetailsSidenav.open()
          : this.userDetailsSidenav.close();
      });
    });

    this.subs.add(s);
  }

  closeUserSidenav() {
    this.sidenavService.close();
  }

  logout() {
    this.auth.logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
