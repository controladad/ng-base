import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacLicensePlateComponent } from './license-plate.component';

describe('CacLicensePlateComponent', () => {
  let component: CacLicensePlateComponent;
  let fixture: ComponentFixture<CacLicensePlateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CacLicensePlateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CacLicensePlateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
