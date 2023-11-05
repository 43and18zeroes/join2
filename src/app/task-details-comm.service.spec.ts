import { TestBed } from '@angular/core/testing';

import { TaskDetailsCommService } from './task-details-comm.service';

describe('TaskDetailsCommService', () => {
  let service: TaskDetailsCommService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskDetailsCommService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
