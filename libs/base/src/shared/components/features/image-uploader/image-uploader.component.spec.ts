import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacImageUploaderComponent } from './image-uploader.component';

describe('CacImageUploaderComponent', () => {
  let component: CacImageUploaderComponent<any, any>;
  let fixture: ComponentFixture<CacImageUploaderComponent<any, any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CacImageUploaderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CacImageUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
