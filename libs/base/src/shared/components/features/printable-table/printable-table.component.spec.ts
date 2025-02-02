import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacPrintableTableComponent } from './printable-table.component';

describe('CacPrintableTableComponent', () => {
  let component: CacPrintableTableComponent;
  let fixture: ComponentFixture<CacPrintableTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CacPrintableTableComponent],
    });
    fixture = TestBed.createComponent(CacPrintableTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
