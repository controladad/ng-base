import { computed, DestroyRef, signal } from '@angular/core';
import { ItemToId } from '../../core';
import { FormControlExtended } from '../forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';

// TODO: Update constructor initial parameters (turn into object, it's messy currently)
// TODO: add formControl binding
// TODO: turn off multiple mode by default

export class SelectionModel<T> {
  private _totalCount = 0;
  private _selectedCount = 0;
  private _multiple;
  private _itemToId: ItemToId<T>;
  private _currentViewItems: T[] = [];
  private _boundFormControl?: FormControlExtended;
  private _blockBoundUpdate = false;

  // unique identifier generated randomly
  id: string;

  public indeterminate = signal(false);
  public allSelected = signal(false);
  public selected = signal<T[]>([]);
  public selectedIds = signal<{ [p: string | number]: boolean }>({});
  public selectedCount = computed(() => this.selected()?.length ?? 0);
  public hasSelection = computed(() => this.selectedCount() !== 0);

  constructor(itemsCount?: number, multiple?: boolean, initial?: T[], itemToId?: ItemToId<T>) {
    this.id = crypto.randomUUID();
    this._totalCount = itemsCount ?? 0;
    this._multiple = multiple ?? true;
    this._itemToId = itemToId ?? (((t) => (t && typeof t === 'object' && 'id' in t ? t.id : t)) as ItemToId<T>);
    initial ? this.select(...initial) : null;
  }

  get isMultiple() {
    return this._multiple;
  }

  public select(...items: T[]) {
    if (this._multiple) {
      this.set(...[...new Set([...this.selected(), ...items])]);
    } else if (items.length) {
      // this.clear();
      this.set(items[0]);
    }
  }

  public deselect(...items: T[]) {
    const itemsId = items.map(this._itemToId);
    this.set(...this.selected().filter((t) => !itemsId.includes(this._itemToId(t))));
  }

  public toggle(...items: T[]) {
    const selected = this.selected();

    if (this._multiple) {
      let newItems: T[] = [...selected];
      if (newItems.length > 0) {
        for (const item of items) {
          const index = selected.findIndex((t) => this._itemToId(t) === this._itemToId(item));
          if (index !== -1) {
            newItems.splice(index, 1);
          } else {
            newItems.push(item);
          }
        }
      } else {
        newItems = [...items];
      }

      this.set(...newItems);
    } else {
      if (selected.some(t => t === items[0])) {
        this.clear();
      } else {
        this.set(items[0]);
      }
    }
  }

  public selectAll() {
    this.select(...this._currentViewItems);
  }

  public deselectAll() {
    this.deselect(...this._currentViewItems);
  }

  public toggleAll() {
    if (this._selectedCount === this._totalCount) {
      this.deselectAll();
    } else {
      this.selectAll();
    }
  }

  public clear() {
    if (this._selectedCount === 0) return;
    this.set();
  }

  public set(...items: T[]) {
    this.selected.set(items);
    this.selectedIds.set(
      items
        .map((t) => this._itemToId(t))
        .reduce(
          (pre, cur) => ({
            ...pre,
            [cur]: true,
          }),
          {},
        ),
    );
    this._selectedCount = items.length;

    this.calculateSelectionState();
    this.updateBoundedFormControl();
  }

  public isSelected(item: T) {
    return !!this.selectedIds()[this._itemToId(item)];
  }

  public setTotalCount(count: number) {
    this._totalCount = count;

    this.calculateSelectionState();
  }

  public setItems(items: T[], setTotalCount = true) {
    this._currentViewItems = items;
    if (setTotalCount) {
      this._totalCount = items.length;
    }

    this.calculateSelectionState();
  }

  public setItemToIdFn(fn: ItemToId<T>) {
    this._itemToId = fn;
  }

  public setMultiple(value?: boolean) {
    this._multiple = value === undefined ? true : value;
  }

  public bindFormControl(control: FormControlExtended | undefined, destroyRef?: DestroyRef) {
    this._boundFormControl = control;
    if (!control) return;

    control.valueChanges.pipe(startWith(control.value), takeUntilDestroyed(destroyRef)).subscribe((v) => {
      if (this._blockBoundUpdate || v === this.selectedIds()) {
        this._blockBoundUpdate = false;
        return;
      }

      if (v === null || v === undefined) {
        this.clear();
      } else {
        this.set(...(v instanceof Array ? v : [v]));
      }
    });
  }

  private updateBoundedFormControl() {
    if (!this._boundFormControl) return;

    this._blockBoundUpdate = true;
    this._boundFormControl.setValue(this.selectedIds());
    this._boundFormControl.setSelectedItems(this.selected());
  }

  private calculateSelectionState() {
    const selectedViewItemsCount = this._currentViewItems
      .map(this._itemToId)
      .filter((t) => this.selectedIds()[t]).length;
    if (this._selectedCount === 0 || selectedViewItemsCount === 0) {
      this.indeterminate.set(false);
      this.allSelected.set(false);
    } else if (this._selectedCount === this._totalCount) {
      this.indeterminate.set(false);
      this.allSelected.set(true);
    } else {
      this.indeterminate.set(selectedViewItemsCount !== this._currentViewItems.length);
      this.allSelected.set(!this.indeterminate());
    }
  }
}
