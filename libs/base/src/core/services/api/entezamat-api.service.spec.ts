import { TestBed } from '@angular/core/testing';

import { EntezamatApiService } from './entezamat-api.service';

describe('EntezamatApiService', () => {
  let service: EntezamatApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntezamatApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
