import { Component, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { SidebarComponent } from '../../../shared-container/sidebar/sidebar';
import { SidenavService } from '../../../../service/sidenav-service';
import { UserDetailsSidenavComponent } from '../../../user-details-container/user-details/user-details';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';

import { AuthService } from '@auth0/auth0-angular'; // ✅ AUTH0 ONLY

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    RouterModule,
    SidebarComponent,
    UserDetailsSidenavComponent,
  ],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.scss']
})
export class MainLayoutComponent implements AfterViewInit, OnDestroy {
  @ViewChild('userDetailsSidenav') userDetailsSidenav!: MatSidenav;

  private subs = new Subscription();
  sidenavUser: any = null;
  loading = false;

  constructor(
    private sidenavService: SidenavService,
    private auth: AuthService
  ) {}

  ngAfterViewInit(): void {
    const s = this.sidenavService.payload$.subscribe(payload => {
      this.sidenavUser = payload.user || null;
      setTimeout(() => {
        payload.open
          ? this.userDetailsSidenav?.open()
          : this.userDetailsSidenav?.close();
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
