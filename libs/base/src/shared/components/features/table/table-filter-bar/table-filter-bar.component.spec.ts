import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacTableFilterBarComponent } from './table-filter-bar.component';

describe('CacTableFilterBarComponent', () => {
  let component: CacTableFilterBarComponent;
  let fixture: ComponentFixture<CacTableFilterBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CacTableFilterBarComponent],
    });
    fixture = TestBed.createComponent(CacTableFilterBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
