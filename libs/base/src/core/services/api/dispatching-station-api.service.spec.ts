import { TestBed } from '@angular/core/testing';

import { DispatchingStationApiService } from './dispatching-station-api.service';

describe('DispatchingStationService', () => {
  let service: DispatchingStationApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DispatchingStationApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
