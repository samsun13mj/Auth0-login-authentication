import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  standalone: true,
  template: `<p>Signing you in...</p>`
})
export class Auth0Callback implements OnInit {
  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.auth.handleRedirectCallback().subscribe();
  }
}
