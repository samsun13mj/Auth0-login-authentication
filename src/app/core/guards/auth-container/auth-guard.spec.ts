import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthGuard } from './auth-guard';
import { AuthService } from '../../../service/auth-service-container/auth-service';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  const authServiceMock = {
    isLoggedIn$: () => of(true)
  };

  const routerMock = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when user is logged in', (done) => {
    guard.canActivate().subscribe(result => {
      expect(result).toBeTrue();
      done();
    });
  });
});
