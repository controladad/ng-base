import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacInitializeProtectionComponent } from './initialize-protection.component';

describe('CacInitializeProtectionComponent', () => {
  let component: CacInitializeProtectionComponent;
  let fixture: ComponentFixture<CacInitializeProtectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CacInitializeProtectionComponent],
    });
    fixture = TestBed.createComponent(CacInitializeProtectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
