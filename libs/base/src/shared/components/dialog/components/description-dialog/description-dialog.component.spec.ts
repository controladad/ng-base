import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacDescriptionDialogComponent } from './description-dialog.component';

describe('CacDescriptionDialogComponent', () => {
  let component: CacDescriptionDialogComponent;
  let fixture: ComponentFixture<CacDescriptionDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CacDescriptionDialogComponent],
    });
    fixture = TestBed.createComponent(CacDescriptionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
