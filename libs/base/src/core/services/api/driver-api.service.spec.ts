import { TestBed } from '@angular/core/testing';

import { DriverApiService } from './driver-api.service';

describe('DriverApiService', () => {
  let service: DriverApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DriverApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
