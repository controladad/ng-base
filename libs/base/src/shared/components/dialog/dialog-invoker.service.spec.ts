import { TestBed } from '@angular/core/testing';

import { DialogInvokerService } from './dialog-invoker.service';

describe('DialogInvokerService', () => {
  let service: DialogInvokerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DialogInvokerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
