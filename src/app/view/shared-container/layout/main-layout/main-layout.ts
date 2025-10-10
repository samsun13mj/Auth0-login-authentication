import { Component, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SidebarComponent } from '../../../shared-container/sidebar/sidebar';
import { SidenavService } from '../../../../service/sidenav-service';
import { UserDetailsSidenavComponent } from '../../../user-details-container/user-details/user-details';
import { MatToolbarModule } from '@angular/material/toolbar'; 
import { MatMenuModule } from '@angular/material/menu';     
import { AuthService } from '../../../../service/auth-service';

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
  _sidenavUser: any = null;
  loading = false;

  constructor(private sidenavService: SidenavService, private authService: AuthService, private router: Router) {}

  ngAfterViewInit(): void {
    const s = this.sidenavService.payload$.subscribe(payload => {
      this._sidenavUser = payload.user || null;
      setTimeout(() => {
        if (payload.open) {
          this.userDetailsSidenav?.open();
        } else {
          this.userDetailsSidenav?.close();
        }
      });
    });
    this.subs.add(s);
  }

  closeUserSidenav() {
    this.sidenavService.close();
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    }).catch(err => console.error('Logout failed:', err));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
