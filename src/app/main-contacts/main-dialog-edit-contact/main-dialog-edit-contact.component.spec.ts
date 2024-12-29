import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainDialogEditContactComponent } from './main-dialog-edit-contact.component';

describe('MainDialogEditContactComponent', () => {
  let component: MainDialogEditContactComponent;
  let fixture: ComponentFixture<MainDialogEditContactComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainDialogEditContactComponent]
    });
    fixture = TestBed.createComponent(MainDialogEditContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
