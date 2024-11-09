import { TestBed } from '@angular/core/testing';

import { BackendServiceService } from './drf/backend-service.service';

describe('BackendServiceService', () => {
  let service: BackendServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackendServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
