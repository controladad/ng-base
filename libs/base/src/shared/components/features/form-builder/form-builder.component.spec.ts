import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacFormBuilderComponent } from './form-builder.component';

describe('CacFormBuilderComponent', () => {
  let component: CacFormBuilderComponent<any>;
  let fixture: ComponentFixture<CacFormBuilderComponent<any>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CacFormBuilderComponent],
    });
    fixture = TestBed.createComponent(CacFormBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
