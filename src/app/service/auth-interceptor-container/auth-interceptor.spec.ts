import { TestBed } from '@angular/core/testing';
import { HttpRequest } from '@angular/common/http';
import { authInterceptor } from './auth-interceptor';

describe('authInterceptor', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(authInterceptor).toBeTruthy();
  });

  it('should intercept request', () => {
    const req = new HttpRequest('GET', '/test');

    const next = {
      handle: jasmine.createSpy('handle')
    };

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, next as any);
    });

    expect(next.handle).toHaveBeenCalled();
  });
});
