import { TestBed } from '@angular/core/testing';

import { MainLayoutService } from './main-layout.service';

describe('MainLayoutService', () => {
  let service: MainLayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainLayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
