import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainDialogAddContactComponent } from './main-dialog-add-contact.component';

describe('MainDialogAddContactComponent', () => {
  let component: MainDialogAddContactComponent;
  let fixture: ComponentFixture<MainDialogAddContactComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainDialogAddContactComponent]
    });
    fixture = TestBed.createComponent(MainDialogAddContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
