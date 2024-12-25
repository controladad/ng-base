import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogLayoutComponent } from './dialog-layout.component';

describe('DialogLayoutComponent', () => {
  let component: DialogLayoutComponent;
  let fixture: ComponentFixture<DialogLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
