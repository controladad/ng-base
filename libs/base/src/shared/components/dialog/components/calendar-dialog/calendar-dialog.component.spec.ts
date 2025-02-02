import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CacCalendarDialogComponent } from './calendar-dialog.component';

describe('CacCalendarDialogComponent', () => {
  let component: CacCalendarDialogComponent;
  let fixture: ComponentFixture<CacCalendarDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CacCalendarDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CacCalendarDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
