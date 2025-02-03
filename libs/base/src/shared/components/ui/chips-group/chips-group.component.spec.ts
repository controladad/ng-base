import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacChipsGroupComponent } from './chips-group.component';

describe('CacChipsGroupComponent', <T>() => {
  let component: CacChipsGroupComponent<T>;
  let fixture: ComponentFixture<CacChipsGroupComponent<T>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CacChipsGroupComponent],
    });
    fixture = TestBed.createComponent(CacChipsGroupComponent<T>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
