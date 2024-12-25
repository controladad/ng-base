import { TestBed } from '@angular/core/testing';

import { TruckingCompanyApiService } from './trucking-company-api.service';

describe('TruckingCompanyApiService', () => {
  let service: TruckingCompanyApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TruckingCompanyApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
