import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchDetailsDialogComponent } from './dispatch-details-dialog.component';

describe('DispatchDetailsDialogComponent', () => {
  let component: DispatchDetailsDialogComponent;
  let fixture: ComponentFixture<DispatchDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DispatchDetailsDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DispatchDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
