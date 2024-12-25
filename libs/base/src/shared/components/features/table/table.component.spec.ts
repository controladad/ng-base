import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableComponent } from './table.component';

describe('TableComponent', () => {
  let component: TableComponent<any>;
  let fixture: ComponentFixture<TableComponent<any>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TableComponent],
    });
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
