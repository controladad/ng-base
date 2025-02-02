import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CacControlErrorComponent } from './control-error.component';

describe('CacControlErrorComponent', () => {
  let component: CacControlErrorComponent;
  let fixture: ComponentFixture<CacControlErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CacControlErrorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CacControlErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
