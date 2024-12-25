import { TestBed } from '@angular/core/testing';

import { ItemApiService } from './item-api.service';

describe('ItemApiService', () => {
  let service: ItemApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
