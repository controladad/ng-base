import { TestBed } from '@angular/core/testing';

import { TrafficBillApiService } from './traffic-bill-api.service';

describe('TrafficBillApiService', () => {
  let service: TrafficBillApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrafficBillApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
