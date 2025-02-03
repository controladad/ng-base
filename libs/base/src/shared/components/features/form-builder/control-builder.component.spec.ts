import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacControlBuilderComponent } from './control-builder.component';

describe('CacControlBuilderComponent', () => {
  let component: CacControlBuilderComponent<any>;
  let fixture: ComponentFixture<CacControlBuilderComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CacControlBuilderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CacControlBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
