import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacTableColIndexComponent } from './table-col-index.component';

describe('CacTableColIndexComponent', () => {
  let component: CacTableColIndexComponent;
  let fixture: ComponentFixture<CacTableColIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CacTableColIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CacTableColIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
