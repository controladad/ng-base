import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleDialogComponent } from './role-dialog.component';

describe('RoleDialogComponent', () => {
  let component: RoleDialogComponent;
  let fixture: ComponentFixture<RoleDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RoleDialogComponent],
    });
    fixture = TestBed.createComponent(RoleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
