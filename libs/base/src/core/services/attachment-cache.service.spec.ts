import { TestBed } from '@angular/core/testing';

import { AttachmentCacheService } from './attachment-cache.service';

describe('AttachmentCacheService', () => {
  let service: AttachmentCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttachmentCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
