import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipsComponent } from './chips.component';

describe('ChipsComponent', () => {
  let component: ChipsComponent<any>;
  let fixture: ComponentFixture<ChipsComponent<any>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ChipsComponent],
    });
    fixture = TestBed.createComponent(ChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
