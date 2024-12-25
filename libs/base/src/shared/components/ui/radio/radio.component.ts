import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  ViewChild,
  signal,
  computed,
} from '@angular/core';
import { UntypedFormControl, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { Observable, take } from 'rxjs';
import { NgForOf, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { UiRadioCompareWithDirective, UiRadioCompareWithFn } from '../../../directives';
import { ItemRecord, ItemRecords$ } from '../../../../core';

@Component({
  selector: 'ui-radio',
  standalone: true,
  imports: [ReactiveFormsModule, MatRadioModule, UiRadioCompareWithDirective, NgIf, NgForOf, MatIconModule],
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
})
export class RadioComponent<T> implements OnInit, OnChanges {
  @ViewChild('RadioGroup') radioGroup!: UiRadioCompareWithDirective<any>;

  @Input() control = new FormControl<T | null | undefined>(null);
  @Input() items: ItemRecords$<T> = [];
  @Input() label?: string;
  @Input() readonly = false;
  @Input() preventDefault = false;
  @Input() value?: T;
  @Input() hiddenItems?: T[];
  @Input() compareFn?: UiRadioCompareWithFn<any>;
  @Output() valueChange = new EventEmitter();

  fetchedItems = signal<ItemRecord<T>[] | undefined>(undefined);
  currentItems = computed(() => {
    const items = this.fetchedItems();
    if (!items) return undefined;
    return this.hiddenItems && this.hiddenItems.length > 0
      ? items.filter((x) => !this.hiddenItems!.includes(x.value))
      : items;
  });

  ngOnInit() {
    if (!this.control) {
      this.control = new UntypedFormControl('');
    }

    this.loadItems();

    if (this.value) {
      this.control.setValue(this.value);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['control'] && this.control === undefined) {
      this.control = new UntypedFormControl('');
    }
    if (changes['items'] && !changes['items'].firstChange) {
      this.fetchedItems.set(undefined);
      this.loadItems();
    }
    if (changes['value']) {
      this.control?.setValue(this.value);
    }
  }

  onValueChange(e: MatRadioChange) {
    if (this.preventDefault) {
      this.control?.setValue(this.value, {
        emitEvent: false,
      });
    }
    this.valueChange.emit(e.value);
  }

  private loadItems() {
    if (this.items instanceof Observable) {
      this.items.pipe(take(1)).subscribe((result) => {
        this.fetchedItems.set(result);
        this.updateControlState();
      });
    } else {
      this.fetchedItems.set(this.items);
      this.updateControlState();
    }
  }

  private updateControlState() {
    this.control?.updateValueAndValidity();
  }
}
