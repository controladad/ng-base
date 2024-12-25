import { TestBed } from '@angular/core/testing';

import { AttachmentApiService } from './attachment-api.service';

describe('AttachmentApiService', () => {
  let service: AttachmentApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttachmentApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
