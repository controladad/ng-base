import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableColActionComponent } from './table-col-action.component';

describe('TableColActionComponent', () => {
  let component: TableColActionComponent;
  let fixture: ComponentFixture<TableColActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableColActionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableColActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
