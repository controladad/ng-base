import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  inject,
  DestroyRef,
  ContentChildren,
  AfterContentInit,
  QueryList,
  input, effect, OnInit
} from '@angular/core';
import { EventEmitter } from '@angular/core';
import { startWith, Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChipsComponent } from '../chips';
import { formControl, FormControlExtended } from '../../../forms';
import { SelectionModel } from '../../../classes';

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

  @ContentChildren(ChipsComponent) contentChildrenChips!: QueryList<ChipsComponent<T>>;

  @Input() toggleable = false;
  @Input() multiple = false;
  control = input<FormControlExtended<T | T[] | undefined>>(formControl());

  @Output() onToggle = new EventEmitter<T[]>();
  @Output() onRadioToggle = new EventEmitter<T>();

  private childrenSub = new Subscription();
  private selectionModel = new SelectionModel<T>();

  constructor() {
    effect(() => {
      this.selectionModel.bindFormControl(this.control(), this.destroyRef);
    });
  }

  ngOnInit() {
    this.selectionModel.setMultiple(this.multiple);
  }

  ngAfterContentInit() {
    this.contentChildrenChips.changes.pipe(startWith(null), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.childrenSub.unsubscribe();
      this.childrenSub = new Subscription();

      this.contentChildrenChips.forEach((chips) => {
        this.childrenSub.add(
          chips.onClick.subscribe(() => {
            if (!this.toggleable) return;
            if (chips.value === undefined) return;
            this.selectionModel.toggle(chips.value);
            this.updateChipsState();
          }),
        );
      });

      this.updateChipsState();
    });
  }

  private updateChipsState() {
    this.contentChildrenChips.forEach((chips) => {
      if (chips.value === undefined) return;
      chips.toggleActive(this.selectionModel.isSelected(chips.value));
    });
  }
}
