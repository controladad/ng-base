import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxGroupComponent } from './checkbox-group.component';

describe('CheckboxGroupComponent', () => {
  let component: CheckboxGroupComponent<any>;
  let fixture: ComponentFixture<CheckboxGroupComponent<any>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheckboxGroupComponent],
    });
    fixture = TestBed.createComponent(CheckboxGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
