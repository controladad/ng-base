import { computed, signal } from '@angular/core';
import { ItemToId } from '../../core';

export class SelectionModel<T extends object> {
  private _totalCount = 0;
  private _selectedCount = 0;
  private _multiple;
  private _itemToId: ItemToId<T>;
  private _currentViewItems: T[] = [];

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
    this._itemToId = itemToId ?? (((t) => ('id' in t ? t.id : t)) as ItemToId<T>);
    initial ? this.select(...initial) : null;
  }

  public select(...items: T[]) {
    if (this._multiple) {
      this.set(...[...new Set([...this.selected(), ...items])]);
    } else if (items.length) {
      this.clear();
      this.set(items[0]);
    }
  }

  public deselect(...items: T[]) {
    const itemsId = items.map(this._itemToId);
    this.set(...this.selected().filter((t) => !itemsId.includes(this._itemToId(t))));
  }

  public toggle(...items: T[]) {
    const selected = this.selected();
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
  }

  public isSelected(item: T) {
    return this.selectedIds()[this._itemToId(item)];
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
