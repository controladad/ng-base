import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacTableFormMenuComponent } from './table-form-menu.component';

describe('CacTableFormMenuComponent', () => {
  let component: CacTableFormMenuComponent;
  let fixture: ComponentFixture<CacTableFormMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CacTableFormMenuComponent],
    });
    fixture = TestBed.createComponent(CacTableFormMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
