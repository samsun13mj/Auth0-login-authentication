import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { NgIf, AsyncPipe, JsonPipe } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [NgIf, AsyncPipe, JsonPipe],
  templateUrl: './reports-component.html',
  styleUrls: ['./reports-component.scss']
})
export class ReportsComponent {

  user$!: Observable<any>;

  constructor(private auth: AuthService) {
    // ✅ SAFE INITIALIZATION
    this.user$ = this.auth.user$;
  }

  login(): void {
    this.auth.loginWithRedirect();
  }

  logout(): void {
    this.auth.logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  }
}
