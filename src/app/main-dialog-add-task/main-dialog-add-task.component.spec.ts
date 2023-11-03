import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainDialogAddTaskComponent } from './main-dialog-add-task.component';

describe('MainDialogAddTaskComponent', () => {
  let component: MainDialogAddTaskComponent;
  let fixture: ComponentFixture<MainDialogAddTaskComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainDialogAddTaskComponent]
    });
    fixture = TestBed.createComponent(MainDialogAddTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
