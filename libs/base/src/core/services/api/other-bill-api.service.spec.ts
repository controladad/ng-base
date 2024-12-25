import { TestBed } from '@angular/core/testing';

import { BillApiService } from './bill-api.service';

describe('BillApiService', () => {
  let service: BillApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BillApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
