import { TestBed } from '@angular/core/testing';

import { BoardCommService } from './board-comm.service';

describe('BoardCommService', () => {
  let service: BoardCommService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoardCommService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
