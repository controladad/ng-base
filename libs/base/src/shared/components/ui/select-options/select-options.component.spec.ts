import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectOptionsComponent } from './select-options.component';

describe('SelectOptionsComponent', () => {
  let component: SelectOptionsComponent<any>;
  let fixture: ComponentFixture<SelectOptionsComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectOptionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
