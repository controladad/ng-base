import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacTableComponent } from './table.component';

describe('CacTableComponent', () => {
  let component: CacTableComponent<any>;
  let fixture: ComponentFixture<CacTableComponent<any>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CacTableComponent],
    });
    fixture = TestBed.createComponent(CacTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
