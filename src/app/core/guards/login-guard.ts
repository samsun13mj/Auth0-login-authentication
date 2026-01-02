import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../service/auth-service';
import { map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate() {
    return this.authService.isLoggedIn$().pipe(
      tap(isLoggedIn => {
        if (isLoggedIn) {
          this.router.navigate(['/dashboard']);
        }
      }),
      map(isLoggedIn => !isLoggedIn)
    );
  }
}
