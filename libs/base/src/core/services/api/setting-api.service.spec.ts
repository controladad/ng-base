import { TestBed } from '@angular/core/testing';

import { SettingApiService } from './setting-api.service';

describe('SettingApiService', () => {
  let service: SettingApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
