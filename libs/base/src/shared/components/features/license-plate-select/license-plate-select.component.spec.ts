import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacLicensePlateSelectComponent } from './license-plate-select.component';

describe('CacLicensePlateSelectComponent', () => {
  let component: CacLicensePlateSelectComponent;
  let fixture: ComponentFixture<CacLicensePlateSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CacLicensePlateSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CacLicensePlateSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
