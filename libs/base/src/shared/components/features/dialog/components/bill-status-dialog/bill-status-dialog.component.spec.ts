import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillStatusDialogComponent } from './bill-status-dialog.component';

describe('BillStatusDialogComponent', () => {
  let component: BillStatusDialogComponent;
  let fixture: ComponentFixture<BillStatusDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BillStatusDialogComponent],
    });
    fixture = TestBed.createComponent(BillStatusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
