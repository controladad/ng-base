import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacSkeletonComponent } from './skeleton.component';

describe('CacSkeletonComponent', () => {
  let component: CacSkeletonComponent;
  let fixture: ComponentFixture<CacSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CacSkeletonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CacSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
