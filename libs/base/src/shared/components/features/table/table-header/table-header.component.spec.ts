import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacTableHeaderComponent } from './table-header.component';

describe('CacTableHeaderComponent', () => {
  let component: CacTableHeaderComponent;
  let fixture: ComponentFixture<CacTableHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CacTableHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CacTableHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
