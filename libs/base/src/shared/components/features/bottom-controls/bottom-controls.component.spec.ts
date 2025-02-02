import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacBottomControlsComponent } from './bottom-controls.component';

describe('CacBottomControlsComponent', () => {
  let component: CacBottomControlsComponent;
  let fixture: ComponentFixture<CacBottomControlsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CacBottomControlsComponent],
    });
    fixture = TestBed.createComponent(CacBottomControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
