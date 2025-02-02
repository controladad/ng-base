import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacFieldViewComponent } from './field-view.component';

describe('CacFieldViewComponent', () => {
  let component: CacFieldViewComponent;
  let fixture: ComponentFixture<CacFieldViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CacFieldViewComponent],
    });
    fixture = TestBed.createComponent(CacFieldViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
