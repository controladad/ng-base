import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBuilderComponent } from './form-builder.component';

describe('FormBuilderComponent', () => {
  let component: FormBuilderComponent<any>;
  let fixture: ComponentFixture<FormBuilderComponent<any>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormBuilderComponent],
    });
    fixture = TestBed.createComponent(FormBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
