import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipsComponent } from './chips.component';

describe('ChipsComponent', () => {
  let component: ChipsComponent;
  let fixture: ComponentFixture<ChipsComponent>;

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
