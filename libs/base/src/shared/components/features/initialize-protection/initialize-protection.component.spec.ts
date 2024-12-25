import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitializeProtectionComponent } from './initialize-protection.component';

describe('InitializeProtectionComponent', () => {
  let component: InitializeProtectionComponent;
  let fixture: ComponentFixture<InitializeProtectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InitializeProtectionComponent],
    });
    fixture = TestBed.createComponent(InitializeProtectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
