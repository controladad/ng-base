import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacInputDialogComponent } from './input-dialog.component';

describe('CacInputDialogComponent', () => {
  let component: CacInputDialogComponent<any, any>;
  let fixture: ComponentFixture<CacInputDialogComponent<any, any>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CacInputDialogComponent],
    });
    fixture = TestBed.createComponent(CacInputDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
