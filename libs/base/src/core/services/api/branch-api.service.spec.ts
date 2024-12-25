import { TestBed } from '@angular/core/testing';

import { BranchApiService } from './branch-api.service';

describe('BranchApiService', () => {
  let service: BranchApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BranchApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
