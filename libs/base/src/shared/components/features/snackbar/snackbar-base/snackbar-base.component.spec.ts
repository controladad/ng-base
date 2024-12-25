import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackbarBaseComponent } from './snackbar-base.component';

describe('SnackbarBaseComponent', () => {
  let component: SnackbarBaseComponent;
  let fixture: ComponentFixture<SnackbarBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnackbarBaseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SnackbarBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
