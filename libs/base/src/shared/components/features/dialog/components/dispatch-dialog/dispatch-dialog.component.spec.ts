import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DispatchDialogComponent } from './dispatch-dialog.component';

describe('DispatchDialogComponent', () => {
  let component: DispatchDialogComponent;
  let fixture: ComponentFixture<DispatchDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DispatchDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DispatchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
