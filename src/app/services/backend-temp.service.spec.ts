import { TestBed } from '@angular/core/testing';

import { BackendTempService } from './backend-temp.service';

describe('BackendTempService', () => {
  let service: BackendTempService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackendTempService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
