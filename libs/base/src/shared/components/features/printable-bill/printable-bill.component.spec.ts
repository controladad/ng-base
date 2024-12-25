import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintableBillComponent } from './printable-bill.component';

describe('PrintableBillComponent', () => {
  let component: PrintableBillComponent;
  let fixture: ComponentFixture<PrintableBillComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PrintableBillComponent],
    });
    fixture = TestBed.createComponent(PrintableBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
