import {
  AfterContentInit,
  ChangeDetectorRef,
  ContentChildren,
  Directive,
  Input,
  OnDestroy,
  QueryList,
} from '@angular/core';
import { startWith, Subscription } from 'rxjs';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { UntypedFormControl } from '@angular/forms';

export type UiRadioCompareWithFn<T> = (itemA: T, itemB: T) => boolean;

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'mat-radio-group[UiRadioCompareWith]',
  exportAs: 'uiRadio',
  standalone: true,
})
export class UiRadioCompareWithDirective<T> implements AfterContentInit, OnDestroy {
  @Input() compareWith: UiRadioCompareWithFn<T> | undefined;
  @Input() formControl!: UntypedFormControl;

  @ContentChildren(MatRadioButton, { descendants: true })
  radioButtons!: QueryList<MatRadioButton>;

  formControlSub = new Subscription();

  constructor(
    private cdr: ChangeDetectorRef,
    public host: MatRadioGroup,
  ) {}

  ngAfterContentInit() {
    if (this.compareWith) {
      this.formControlSub = this.formControl.valueChanges.pipe(startWith(this.formControl.value)).subscribe((value) => {
        const foundRadioButton = this.radioButtons.toArray().find((radioButton) => {
          return this.compareWith ? this.compareWith(radioButton.value, value) : (x: T, y: T) => x === y;
        });
        if (foundRadioButton) {
          foundRadioButton.checked = true;
          this.cdr.detectChanges();
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.formControlSub.unsubscribe();
  }
}
