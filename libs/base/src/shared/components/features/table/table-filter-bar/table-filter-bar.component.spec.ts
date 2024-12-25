import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableFilterBarComponent } from './table-filter-bar.component';

describe('TableFilterBarComponent', () => {
  let component: TableFilterBarComponent;
  let fixture: ComponentFixture<TableFilterBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TableFilterBarComponent],
    });
    fixture = TestBed.createComponent(TableFilterBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
