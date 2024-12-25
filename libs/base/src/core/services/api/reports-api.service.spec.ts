import { TestBed } from '@angular/core/testing';

import { ReportsApiService } from './reports-api.service';

describe('ReportsApiService', () => {
  let service: ReportsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
