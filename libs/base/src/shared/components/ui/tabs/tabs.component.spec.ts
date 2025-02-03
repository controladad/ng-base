import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacTabsComponent } from './tabs.component';

describe('CacTabsComponent', () => {
  let component: CacTabsComponent;
  let fixture: ComponentFixture<CacTabsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CacTabsComponent],
    });
    fixture = TestBed.createComponent(CacTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
