import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableFilterMenuComponent } from './table-filter-menu.component';

describe('TableFilterMenuComponent', () => {
  let component: TableFilterMenuComponent<any>;
  let fixture: ComponentFixture<TableFilterMenuComponent<any>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TableFilterMenuComponent],
    });
    fixture = TestBed.createComponent(TableFilterMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
