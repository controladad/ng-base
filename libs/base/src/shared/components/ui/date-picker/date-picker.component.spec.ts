import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacDatePickerComponent } from './date-picker.component';

describe('CacDatePickerComponent', () => {
  let component: CacDatePickerComponent;
  let fixture: ComponentFixture<CacDatePickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CacDatePickerComponent],
    });
    fixture = TestBed.createComponent(CacDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
