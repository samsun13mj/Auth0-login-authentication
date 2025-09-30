import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../service/auth-service';

export const AuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const user = localStorage.getItem('token');
  if (user) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
