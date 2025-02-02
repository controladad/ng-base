import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldPageComponent } from './field-page.component';

describe('FieldPageComponent', () => {
  let component: FieldPageComponent;
  let fixture: ComponentFixture<FieldPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
