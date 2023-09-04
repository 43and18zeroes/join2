import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthPasswordMailComponent } from './auth-password-mail.component';

describe('AuthPasswordMailComponent', () => {
  let component: AuthPasswordMailComponent;
  let fixture: ComponentFixture<AuthPasswordMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthPasswordMailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthPasswordMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
