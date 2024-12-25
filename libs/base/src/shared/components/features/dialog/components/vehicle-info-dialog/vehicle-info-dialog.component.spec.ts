import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleInfoDialogComponent } from './vehicle-info-dialog.component';

describe('VehicleInfoDialogComponent', () => {
  let component: VehicleInfoDialogComponent;
  let fixture: ComponentFixture<VehicleInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleInfoDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
