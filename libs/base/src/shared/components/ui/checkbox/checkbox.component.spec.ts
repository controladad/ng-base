import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacCheckboxComponent } from './checkbox.component';

describe('CacCheckboxComponent', () => {
  let component: CacCheckboxComponent;
  let fixture: ComponentFixture<CacCheckboxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CacCheckboxComponent],
    });
    fixture = TestBed.createComponent(CacCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
