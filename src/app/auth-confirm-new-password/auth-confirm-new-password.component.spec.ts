import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthConfirmNewPasswordComponent } from './auth-confirm-new-password.component';

describe('ConfirmNewPasswordComponent', () => {
  let component: AuthConfirmNewPasswordComponent;
  let fixture: ComponentFixture<AuthConfirmNewPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthConfirmNewPasswordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthConfirmNewPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
