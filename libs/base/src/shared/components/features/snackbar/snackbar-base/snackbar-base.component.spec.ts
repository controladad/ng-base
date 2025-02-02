import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacSnackbarBaseComponent } from './snackbar-base.component';

describe('CacSnackbarBaseComponent', () => {
  let component: CacSnackbarBaseComponent;
  let fixture: ComponentFixture<CacSnackbarBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CacSnackbarBaseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CacSnackbarBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
