import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipsGroupComponent } from './chips-group.component';

describe('ChipsGroupComponent', <T>() => {
  let component: ChipsGroupComponent<T>;
  let fixture: ComponentFixture<ChipsGroupComponent<T>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChipsGroupComponent],
    });
    fixture = TestBed.createComponent(ChipsGroupComponent<T>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
