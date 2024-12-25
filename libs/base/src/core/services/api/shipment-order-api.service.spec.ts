import { TestBed } from '@angular/core/testing';

import { ShipmentOrderApiService } from './shipment-order-api.service';

describe('ShipmentOrderApiService', () => {
  let service: ShipmentOrderApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShipmentOrderApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
