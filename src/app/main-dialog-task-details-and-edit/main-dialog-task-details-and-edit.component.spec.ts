import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainDialogTaskDetailsAndEditComponent } from './main-dialog-task-details-and-edit.component';

describe('MainDialogTaskDetailsAndEditComponent', () => {
  let component: MainDialogTaskDetailsAndEditComponent;
  let fixture: ComponentFixture<MainDialogTaskDetailsAndEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainDialogTaskDetailsAndEditComponent]
    });
    fixture = TestBed.createComponent(MainDialogTaskDetailsAndEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
