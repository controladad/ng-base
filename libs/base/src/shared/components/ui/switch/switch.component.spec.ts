import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacSwitchComponent } from './switch.component';

describe('CacSwitchComponent', () => {
  let component: CacSwitchComponent;
  let fixture: ComponentFixture<CacSwitchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CacSwitchComponent],
    });
    fixture = TestBed.createComponent(CacSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
