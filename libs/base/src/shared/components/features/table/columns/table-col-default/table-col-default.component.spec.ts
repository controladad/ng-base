import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableColDefaultComponent } from './table-col-default.component';

describe('TableColDefaultComponent', () => {
  let component: TableColDefaultComponent;
  let fixture: ComponentFixture<TableColDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableColDefaultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableColDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
