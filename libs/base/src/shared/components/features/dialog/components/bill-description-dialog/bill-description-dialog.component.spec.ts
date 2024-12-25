import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BillDescriptionDialogComponent } from './bill-description-dialog.component';

describe('BillDescriptionDialogComponent', () => {
  let component: BillDescriptionDialogComponent;
  let fixture: ComponentFixture<BillDescriptionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillDescriptionDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BillDescriptionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
