import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentOrderCreateDialogComponent } from './shipment-order-create-dialog.component';

describe('ShipmentOrderCreateDialogComponent', () => {
  let component: ShipmentOrderCreateDialogComponent;
  let fixture: ComponentFixture<ShipmentOrderCreateDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ShipmentOrderCreateDialogComponent],
    });
    fixture = TestBed.createComponent(ShipmentOrderCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
