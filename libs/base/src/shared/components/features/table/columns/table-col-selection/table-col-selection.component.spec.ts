import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacTableColSelectionComponent } from './table-col-selection.component';

describe('CacTableColSelectionComponent', () => {
  let component: CacTableColSelectionComponent;
  let fixture: ComponentFixture<CacTableColSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CacTableColSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CacTableColSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
