import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailsSidenavComponent } from './user-details';

describe('UserDetails', () => {
  let component: UserDetailsSidenavComponent;
  let fixture: ComponentFixture<UserDetailsSidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDetailsSidenavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDetailsSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
