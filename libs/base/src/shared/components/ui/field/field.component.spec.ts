import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { CacFieldComponent } from './field.component';

describe('CacFieldComponent', () => {
  let component: CacFieldComponent<any>;
  let fixture: ComponentFixture<CacFieldComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CacFieldComponent, MatIcon],
      imports: [
        NoopAnimationsModule,
        MatInputModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatIconTestingModule,
        MatDatepickerModule,
        MatButtonModule,
        MatChipsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CacFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
