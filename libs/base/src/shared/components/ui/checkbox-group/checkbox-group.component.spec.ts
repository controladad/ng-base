import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacCheckboxGroupComponent } from './checkbox-group.component';

describe('CacCheckboxGroupComponent', () => {
  let component: CacCheckboxGroupComponent<any>;
  let fixture: ComponentFixture<CacCheckboxGroupComponent<any>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CacCheckboxGroupComponent],
    });
    fixture = TestBed.createComponent(CacCheckboxGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
