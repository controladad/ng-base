import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacChipsComponent } from './chips.component';

describe('CacChipsComponent', () => {
  let component: CacChipsComponent<any>;
  let fixture: ComponentFixture<CacChipsComponent<any>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CacChipsComponent],
    });
    fixture = TestBed.createComponent(CacChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
