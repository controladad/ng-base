import { DispatchCreateVehicleDialogComponent } from './dispatch-create-vehicle-dialog.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('DispatchCreateVehicleDialogComponent', () => {
  let component: DispatchCreateVehicleDialogComponent;
  let fixture: ComponentFixture<DispatchCreateVehicleDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DispatchCreateVehicleDialogComponent],
    });
    fixture = TestBed.createComponent(DispatchCreateVehicleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
