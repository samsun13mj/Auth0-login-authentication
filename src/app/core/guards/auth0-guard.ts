import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class Auth0Guard implements CanActivate {
  constructor(private auth: AuthService) {}

  canActivate() {
    return this.auth.isAuthenticated$.pipe(
      map(isAuth => {
        if (!isAuth) {
          this.auth.loginWithRedirect();
          return false;
        }
        return true;
      })
    );
  }
}
