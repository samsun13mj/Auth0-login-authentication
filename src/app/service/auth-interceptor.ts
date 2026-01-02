import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { from, switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  return from(auth.getAccessTokenSilently()).pipe(
    switchMap(token =>
      next(
        req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        })
      )
    )
  );
};
