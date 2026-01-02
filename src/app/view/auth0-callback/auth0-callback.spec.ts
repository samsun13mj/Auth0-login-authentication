import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Auth0Callback } from './auth0-callback';

describe('Auth0Callback', () => {
  let component: Auth0Callback;
  let fixture: ComponentFixture<Auth0Callback>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Auth0Callback]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Auth0Callback);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
