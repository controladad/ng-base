import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreateDialogComponent } from './user-create-dialog.component';

describe('UserCreateDialogComponent', () => {
  let component: UserCreateDialogComponent;
  let fixture: ComponentFixture<UserCreateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCreateDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
