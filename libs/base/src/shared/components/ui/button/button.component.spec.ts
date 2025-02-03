import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacButtonComponent } from './button.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('CacButtonComponent', () => {
  let component: CacButtonComponent;
  let fixture: ComponentFixture<CacButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [CacButtonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CacButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
