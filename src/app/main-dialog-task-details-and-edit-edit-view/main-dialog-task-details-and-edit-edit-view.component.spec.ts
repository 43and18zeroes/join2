import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainDialogTaskDetailsAndEditEditViewComponent } from './main-dialog-task-details-and-edit-edit-view.component';

describe('MainDialogTaskDetailsAndEditEditViewComponent', () => {
  let component: MainDialogTaskDetailsAndEditEditViewComponent;
  let fixture: ComponentFixture<MainDialogTaskDetailsAndEditEditViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainDialogTaskDetailsAndEditEditViewComponent]
    });
    fixture = TestBed.createComponent(MainDialogTaskDetailsAndEditEditViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
