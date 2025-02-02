import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacTableColActionComponent } from './table-col-action.component';

describe('CacTableColActionComponent', () => {
  let component: CacTableColActionComponent;
  let fixture: ComponentFixture<CacTableColActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CacTableColActionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CacTableColActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
