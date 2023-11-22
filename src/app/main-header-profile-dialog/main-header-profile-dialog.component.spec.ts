import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainHeaderProfileDialogComponent } from './main-header-profile-dialog.component';

describe('MainHeaderProfileDialogComponent', () => {
  let component: MainHeaderProfileDialogComponent;
  let fixture: ComponentFixture<MainHeaderProfileDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainHeaderProfileDialogComponent]
    });
    fixture = TestBed.createComponent(MainHeaderProfileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
