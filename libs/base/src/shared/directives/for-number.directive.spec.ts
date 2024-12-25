import { ForNumberDirective } from './for-number.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('ForNumberDirective', () => {
  let component: ForNumberDirective;
  let fixture: ComponentFixture<ForNumberDirective>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForNumberDirective],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForNumberDirective);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
