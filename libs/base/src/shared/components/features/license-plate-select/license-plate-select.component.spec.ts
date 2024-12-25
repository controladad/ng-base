import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicensePlateSelectComponent } from './license-plate-select.component';

describe('LicensePlateSelectComponent', () => {
  let component: LicensePlateSelectComponent;
  let fixture: ComponentFixture<LicensePlateSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LicensePlateSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LicensePlateSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
