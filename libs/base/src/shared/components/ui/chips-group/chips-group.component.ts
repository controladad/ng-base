import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  inject,
  DestroyRef,
  signal,
  ContentChildren,
  AfterContentInit,
  QueryList,
  OnInit,
} from '@angular/core';
import { EventEmitter } from '@angular/core';
import { startWith, Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChipsComponent } from '../chips';
import { formControl, FormControlExtended } from '../../../forms';

@Component({
  selector: 'ui-chips-group',
  templateUrl: './chips-group.component.html',
  styleUrls: ['./chips-group.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class ChipsGroupComponent<T> implements OnInit, AfterContentInit {
  readonly destroyRef = inject(DestroyRef);

  @ContentChildren(ChipsComponent) childrenChips!: QueryList<ChipsComponent<T>>;

  @Input() toggleable = false;
  @Input() radio = false;
  @Input() value?: T;
  @Input() control?: FormControlExtended<T | undefined> = formControl();

  @Output() onToggle = new EventEmitter<T | undefined>();

  private childrenSub = new Subscription();
  private _preventValueChangeEmit = false;

  toggledValue = signal<T | undefined>(undefined);

  ngOnInit() {
    if (this.control && this.value) {
      this.control.setValue(this.value);
    }
    if (this.value !== undefined) {
      this.toggledValue.set(this.value);
    }

    this.control?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      if (this._preventValueChangeEmit) {
        this._preventValueChangeEmit = false;
        return;
      }

      this.onChipsToggle(value);
    });
  }

  ngAfterContentInit() {
    this.childrenChips.changes.pipe(startWith(null), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.childrenSub.unsubscribe();
      this.childrenSub = new Subscription();
      this.childrenChips.forEach((chips) => {
        this.childrenSub.add(
          chips.onClick.subscribe(() => {
            if (!this.toggleable && !this.radio) return;
            if (chips.value === undefined) return;
            this.onChipsToggle(chips.value);
          }),
        );
      });
      if (this.toggledValue() !== undefined) {
        this.onChipsToggle(this.toggledValue());
      }
    });
  }

  onChipsToggle(value: T | undefined) {
    if (value === undefined) {
      this.toggledValue.set(undefined);
    } else if (this.toggledValue() === value && !this.radio) {
      this.toggledValue.set(undefined);
    } else {
      this.toggledValue.set(value);
    }
    this._preventValueChangeEmit = true;
    this.control?.setValue(this.toggledValue());
    this.onToggle.emit(this.toggledValue());

    this.childrenChips.forEach((chips) => {
      if (chips.value === undefined) return;
      chips.toggleActive(this.toggledValue() === chips.value);
    });
  }
}
