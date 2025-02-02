import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacTableColDefaultComponent } from './table-col-default.component';

describe('CacTableColDefaultComponent', () => {
  let component: CacTableColDefaultComponent;
  let fixture: ComponentFixture<CacTableColDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CacTableColDefaultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CacTableColDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
