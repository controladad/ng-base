import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacTableFilterComponent } from './table-filter.component';

describe('CacTableFilterComponent', () => {
  let component: CacTableFilterComponent<any>;
  let fixture: ComponentFixture<CacTableFilterComponent<any>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CacTableFilterComponent],
    });
    fixture = TestBed.createComponent(CacTableFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
