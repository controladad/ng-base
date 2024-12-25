import { TestBed } from '@angular/core/testing';

import { WeighingStationApiService } from './weighing-station-api.service';

describe('WeighingStationApiService', () => {
  let service: WeighingStationApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeighingStationApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
