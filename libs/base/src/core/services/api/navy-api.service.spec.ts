import { TestBed } from '@angular/core/testing';

import { NavyApiService } from './navy-api.service';

describe('NavyApiService', () => {
  let service: NavyApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavyApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
