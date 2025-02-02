import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacSliderComponent } from './slider.component';

describe('CacSliderComponent', () => {
  let component: CacSliderComponent;
  let fixture: ComponentFixture<CacSliderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CacSliderComponent],
    });
    fixture = TestBed.createComponent(CacSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
