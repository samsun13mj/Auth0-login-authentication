import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthRoleService } from '../../service/auth-role-service';
import { map } from 'rxjs';

export const adminGuard: CanActivateFn = () => {
  const roleService = inject(AuthRoleService);

  return roleService.isAdmin$.pipe(
    map(isAdmin => isAdmin)
  );
};
