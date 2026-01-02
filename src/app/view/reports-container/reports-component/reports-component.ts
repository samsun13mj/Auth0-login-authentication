import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { NgIf, AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  standalone: true,
  imports: [NgIf, AsyncPipe, JsonPipe],
  template: `
    <h2>Reports Page (Auth0)</h2>

    <button (click)="login()">Login</button>
    <button (click)="logout()">Logout</button>

    <pre *ngIf="user$ | async as user">
{{ user | json }}
    </pre>
  `
})
export class ReportsComponent {
  user$;

  constructor(private auth: AuthService) {
    this.user$ = this.auth.user$;
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
