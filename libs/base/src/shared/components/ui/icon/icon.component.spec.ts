import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacIconComponent } from './icon.component';

describe('CacIconComponent', () => {
  let component: CacIconComponent;
  let fixture: ComponentFixture<CacIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CacIconComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CacIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
