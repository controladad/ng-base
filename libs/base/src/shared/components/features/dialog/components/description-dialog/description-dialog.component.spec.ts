import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionDialogComponent } from './description-dialog.component';

describe('DescriptionDialogComponent', () => {
  let component: DescriptionDialogComponent;
  let fixture: ComponentFixture<DescriptionDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DescriptionDialogComponent],
    });
    fixture = TestBed.createComponent(DescriptionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
