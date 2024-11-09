import { TestBed } from '@angular/core/testing';

import { BackendUserDataService } from './backend-user-data.service';

describe('BackendUserDataService', () => {
  let service: BackendUserDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackendUserDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
