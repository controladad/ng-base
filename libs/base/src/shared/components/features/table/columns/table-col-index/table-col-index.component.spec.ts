import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableColIndexComponent } from './table-col-index.component';

describe('TableColIndexComponent', () => {
  let component: TableColIndexComponent;
  let fixture: ComponentFixture<TableColIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableColIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableColIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
