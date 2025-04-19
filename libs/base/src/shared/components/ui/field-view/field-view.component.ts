import { Component, Input, OnChanges, OnDestroy, signal, SimpleChanges } from '@angular/core';
import { ArrayHelper, ItemRecord, ItemRecords$ } from '../../../../core';
import { Observable, of, Subscription, tap } from 'rxjs';
import { FormControlExtended } from '@al00x/forms';

@Component({
  selector: 'cac-field-view',
  standalone: true,
  imports: [],
  templateUrl: './field-view.component.html',
  styleUrls: ['./field-view.component.scss'],
})
export class CacFieldViewComponent implements OnChanges, OnDestroy {
  @Input() control?: FormControlExtended;
  @Input() value?: any;
  @Input() items?: ItemRecords$<any, any>;
  @Input() emptyValue?: string = '-';

  itemsUpdateSub = new Subscription();
  controlUpdateSub = new Subscription();
  currentItems = signal<ItemRecord<any, any>[] | undefined>(undefined);
  displayValue = signal('');

  ngOnChanges(changes: SimpleChanges) {
    if (changes['items']) {
      this.itemsUpdateSub?.unsubscribe();
      this.currentItems.set(undefined);
      const updateItems$ = this.items
        ? (this.items instanceof Observable ? this.items : of(this.items)).pipe(
            tap(() => {
              this.currentItems.set(undefined);
            }),
            tap((result) => {
              if (result instanceof Array) {
                this.currentItems.set(result);
                this.updateView();
              }
            }),
          )
        : undefined;

      this.itemsUpdateSub = updateItems$ ? updateItems$.subscribe() : new Subscription();
    }
    if (changes['control']) {
      this.controlUpdateSub?.unsubscribe();
      if (this.control) {
        this.controlUpdateSub = this.control?.value$.subscribe(() => {
          this.updateView();
        });
      }
    }
    if (changes['value'] && !this.control) {
      this.updateView();
    }
  }

  ngOnDestroy() {
    this.itemsUpdateSub.unsubscribe();
    this.controlUpdateSub.unsubscribe();
  }

  updateView() {
    const label = this.getLabel();
    this.control?.setDisplayText(label);
    this.displayValue.set(label);
  }

  getLabel() {
    const value = this.control?.value ?? this.value;
    if (value === undefined) return this.emptyValue;
    if (!this.items) return value;
    const currentItems = this.currentItems();
    if (!currentItems) return this.emptyValue;
    const item = ArrayHelper.getFromItemRecord(currentItems, value);
    if (!item && value === null) return this.emptyValue;
    if (!item) return value;
    return item.label;
  }
}
