import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { LoginGuard } from './login-guard';
import { AuthService } from '../../../service/auth-service-container/auth-service';

describe('LoginGuard', () => {
  let guard: LoginGuard;

  const authServiceMock = {
    isLoggedIn$: () => of(false)
  };

  const routerMock = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoginGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    guard = TestBed.inject(LoginGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when user is not logged in', (done) => {
    guard.canActivate().subscribe(result => {
      expect(result).toBeTrue();
      done();
    });
  });
});
