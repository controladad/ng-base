import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacLoaderScreenComponent } from './loader-screen.component';

describe('CacLoaderScreenComponent', () => {
  let component: CacLoaderScreenComponent;
  let fixture: ComponentFixture<CacLoaderScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CacLoaderScreenComponent],
    });
    fixture = TestBed.createComponent(CacLoaderScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
