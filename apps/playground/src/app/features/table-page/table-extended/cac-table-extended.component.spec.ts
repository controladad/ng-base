import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CacTableExtenderDirective } from './cac-table-extender.directive';

describe('TableExtendedComponent', () => {
  let component: CacTableExtenderDirective;
  let fixture: ComponentFixture<CacTableExtenderDirective>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CacTableExtenderDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(CacTableExtenderDirective);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
