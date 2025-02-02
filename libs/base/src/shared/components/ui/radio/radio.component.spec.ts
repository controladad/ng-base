import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacRadioComponent } from './radio.component';

describe('CacRadioComponent', () => {
  let component: CacRadioComponent<any>;
  let fixture: ComponentFixture<CacRadioComponent<any>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CacRadioComponent],
    });
    fixture = TestBed.createComponent(CacRadioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
