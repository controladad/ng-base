import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacLoginFormComponent } from './login-form.component';

describe('CacLoginFormComponent', () => {
  let component: CacLoginFormComponent;
  let fixture: ComponentFixture<CacLoginFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CacLoginFormComponent],
    });
    fixture = TestBed.createComponent(CacLoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
