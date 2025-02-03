import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacSelectOptionsComponent } from './select-options.component';

describe('CacSelectOptionsComponent', () => {
  let component: CacSelectOptionsComponent<any>;
  let fixture: ComponentFixture<CacSelectOptionsComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CacSelectOptionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CacSelectOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
