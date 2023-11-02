import { TestBed } from '@angular/core/testing';

import { MainCommunicationService } from './main-communication.service';

describe('MainCommunicationService', () => {
  let service: MainCommunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainCommunicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
