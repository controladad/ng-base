import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacPromptDialogComponent } from './prompt-dialog.component';

describe('CacPromptDialogComponent', () => {
  let component: CacPromptDialogComponent;
  let fixture: ComponentFixture<CacPromptDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CacPromptDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CacPromptDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
