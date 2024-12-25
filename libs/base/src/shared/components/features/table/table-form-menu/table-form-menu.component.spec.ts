import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableFormMenuComponent } from './table-form-menu.component';

describe('TableFormMenuComponent', () => {
  let component: TableFormMenuComponent;
  let fixture: ComponentFixture<TableFormMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TableFormMenuComponent],
    });
    fixture = TestBed.createComponent(TableFormMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
