import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIcon } from '@angular/material/icon';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import { CacPaginationComponent } from './pagination.component';

describe('CacPaginationComponent', () => {
  let component: CacPaginationComponent;
  let fixture: ComponentFixture<CacPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CacPaginationComponent, MatIcon],
      imports: [MatIconTestingModule],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CacPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
