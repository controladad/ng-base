import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacTableFilterMenuComponent } from './table-filter-menu.component';

describe('CacTableFilterMenuComponent', () => {
  let component: CacTableFilterMenuComponent<any>;
  let fixture: ComponentFixture<CacTableFilterMenuComponent<any>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CacTableFilterMenuComponent],
    });
    fixture = TestBed.createComponent(CacTableFilterMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
