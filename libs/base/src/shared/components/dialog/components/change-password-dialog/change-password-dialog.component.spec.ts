import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacChangePasswordDialogComponent } from './change-password-dialog.component';

describe('CacChangePasswordDialogComponent', () => {
  let component: CacChangePasswordDialogComponent;
  let fixture: ComponentFixture<CacChangePasswordDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CacChangePasswordDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CacChangePasswordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
