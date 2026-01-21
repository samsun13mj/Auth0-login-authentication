import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthRoleService {

  roles$: Observable<string[]>;
  isAdmin$: Observable<boolean>;

  constructor(private auth: AuthService) {

    this.roles$ = this.auth.user$.pipe(
      map(user => user?.['https://bezohminds.com/roles'] || [])
    );

    this.isAdmin$ = this.roles$.pipe(
      map(roles => roles.includes('admin'))
    );
  }
}
