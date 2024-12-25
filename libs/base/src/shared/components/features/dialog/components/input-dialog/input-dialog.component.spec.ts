import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputDialogComponent } from './input-dialog.component';

describe('InputDialogComponent', () => {
  let component: InputDialogComponent<any>;
  let fixture: ComponentFixture<InputDialogComponent<any>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InputDialogComponent],
    });
    fixture = TestBed.createComponent(InputDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
