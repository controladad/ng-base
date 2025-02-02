import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacDialogLayoutComponent } from './dialog-layout.component';

describe('CacDialogLayoutComponent', () => {
  let component: CacDialogLayoutComponent;
  let fixture: ComponentFixture<CacDialogLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CacDialogLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CacDialogLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
