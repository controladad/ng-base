import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchBillDetailsDialogComponent } from './dispatch-bill-details-dialog.component';

describe('BillStatusDialogComponent', () => {
  let component: DispatchBillDetailsDialogComponent;
  let fixture: ComponentFixture<DispatchBillDetailsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DispatchBillDetailsDialogComponent],
    });
    fixture = TestBed.createComponent(DispatchBillDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
