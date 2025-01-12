import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableColSelectionComponent } from './table-col-selection.component';

describe('TableColSelectionComponent', () => {
  let component: TableColSelectionComponent;
  let fixture: ComponentFixture<TableColSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableColSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableColSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
