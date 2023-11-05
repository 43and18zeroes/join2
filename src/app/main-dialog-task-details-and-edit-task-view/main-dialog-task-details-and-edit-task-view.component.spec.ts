import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainDialogTaskDetailsAndEditTaskViewComponent } from './main-dialog-task-details-and-edit-task-view.component';

describe('MainDialogTaskDetailsAndEditTaskViewComponent', () => {
  let component: MainDialogTaskDetailsAndEditTaskViewComponent;
  let fixture: ComponentFixture<MainDialogTaskDetailsAndEditTaskViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainDialogTaskDetailsAndEditTaskViewComponent]
    });
    fixture = TestBed.createComponent(MainDialogTaskDetailsAndEditTaskViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
