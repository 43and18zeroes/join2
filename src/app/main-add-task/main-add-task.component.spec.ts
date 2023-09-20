import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainAddTaskComponent } from './main-add-task.component';

describe('MainAddTaskComponent', () => {
  let component: MainAddTaskComponent;
  let fixture: ComponentFixture<MainAddTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainAddTaskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainAddTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
