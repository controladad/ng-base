import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  signal,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  BehaviorSubject,
  debounce,
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
  Observable,
  of,
  startWith,
  Subscription,
  tap,
  timer,
} from 'rxjs';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { AsyncPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OverlayRef } from '@angular/cdk/overlay';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CacCheckboxComponent } from '../checkbox';
import {
  arraysEqual,
  ItemRecord,
  ItemRecords$,
} from '../../../../core';
import { SelectionModel } from '../../../classes';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CacChipsGroupComponent } from '../chips-group';
import { CacChipsComponent } from '../chips';
import { formControl, FormControlExtended, isFormControlExtended } from '@al00x/forms';

interface SelectItem<T> extends ItemRecord<T> {
  optional?: boolean;
  type?: 'selectAll';
}

// Min is used when the given items are Array
const FILTER_DEBOUNCE_MIN = 50;
// Max is used when the given items are Observable
const FILTER_DEBOUNCE_MAX = 250;

// TODO: Fix role & permissions

@Component({
  selector: 'cac-select-options',
  standalone: true,
  imports: [
    MatMenuModule,
    AsyncPipe,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatIconModule,
    CacCheckboxComponent,
    MatButtonModule,
    MatButtonToggleModule,
    CacChipsGroupComponent,
    CacChipsComponent
],
  templateUrl: './select-options.component.html',
  styleUrls: ['./select-options.component.scss'],
})
export class CacSelectOptionsComponent<T> implements OnChanges, AfterViewInit, OnDestroy {
  destroyRef = inject(DestroyRef);


  readonly SEARCH_OR_ADD_TEXT = $localize`:@@base.ui.select.searchOrAddValue:Search Or Add A Value...`
  readonly SEARCH_TEXT = $localize`:@@base.ui.select.search:Search In Items ...`
  readonly N_ITEMS_SELECTED_TEXT = $localize`:@@base.ui.select.nItemsSelected:Item(s) Selected`
  readonly CHOOSE_OPTIONAL_VALUE_TEXT = $localize`:@@base.ui.select.chooseOptionalValue:Choose Optional Value:`
  readonly LOADING_TEXT = $localize`:@@base.ui.select.loading:Loading..`
  readonly NO_ITEMS_AVAILABLE_TEXT = $localize`:@@base.ui.select.noItemsAvailable:No Matching Items Found.`

  @ViewChild('Trigger') trigger!: MatMenuTrigger;
  @ViewChild('Wrapper') wrapperEl!: ElementRef<HTMLDivElement>;
  @ViewChild('FilterInput') filterInputEl?: ElementRef<HTMLInputElement>;
  @ViewChild('Panel') panelEl!: ElementRef<HTMLDivElement>;
  @ViewChild('Container') containerEl!: ElementRef<HTMLDivElement>;

  @Input() control: FormControlExtended = formControl(null);
  @Input() items?: ItemRecords$<T, any> | undefined;
  @Input() requiredCharactersForFilter = 1;
  @Input() filterStrategy: 'startWith' | 'includes' = 'includes';
  // Can select a value that doesn't exist in the list.
  @Input() optional?: boolean;
  @Input() searchable?: boolean;
  @Input() menuClass?: string;
  @Input() multiple?: boolean;
  @Input() showIcons?: boolean;
  @Input() categories?: ItemRecords$<string | number, any> | undefined;

  @Output() menuClosed = new EventEmitter();
  @Output() onSelect = new EventEmitter<T>();
  @Output() onKeydown = new EventEmitter<KeyboardEvent>();
  @Output() onMultiSelect = new EventEmitter<ItemRecord<T>[]>();

  originalItems$ = new BehaviorSubject<ItemRecord<T>[] | undefined>(undefined);
  categories$ = new BehaviorSubject<ItemRecord<string | number>[] | undefined>(undefined);
  filteredItems$ = new BehaviorSubject<SelectItem<T>[] | undefined>(undefined);
  itemsUpdateSub = new Subscription();
  categoriesUpdateSub = new Subscription();
  controlSub = new Subscription();
  customInputSub = new Subscription();

  public currentItemControl = formControl<SelectItem<T> | null | undefined>(undefined);
  public filterControl = formControl('');
  public categoryControl = formControl<string | number | undefined>(undefined);

  public isLoading$ = this.originalItems$.pipe(map((t) => t === undefined));
  isClosing = false;
  isOpening = false;

  private _initialValue?: T;
  private _instanceOfItems?: 'array' | 'observable';
  private _recentOptionalItems: SelectItem<T>[] = [];
  private _customInput?: HTMLInputElement;
  protected _selectionModel = new SelectionModel<SelectItem<any>>(undefined, true, undefined, (o) => {
    return o.label;
    // const val = o.value;
    // if (typeof val === 'boolean') return val ? BOOLEAN_TRUE : BOOLEAN_FALSE;
    // else if (val === null) return NULL_VALUE;
    // return val;
  });

  currentFocusIndex = signal(-1);
  protected _showingOptionalValue = signal(false);

  constructor() {
    this.currentItemControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((item) => {
      if (this.multiple) {
        this.control.setDisplayText((item as any)?.map((t: ItemRecord<T>) => t.label)?.join(', ') ?? '');
        this.control.setSelectedItems((item as any) ?? []);
      } else {
        this.control.setDisplayText(item?.label ?? '');
        this.control.setSelectedItems(item ? [item] : []);
      }
    });

    merge(
      this.originalItems$,
      this.filterControl.valueChanges.pipe(
        distinctUntilChanged(),
        debounce((v) =>
          v ? timer(this._instanceOfItems === 'observable' ? FILTER_DEBOUNCE_MAX : FILTER_DEBOUNCE_MIN) : of(v),
        ),
      ),
      this.categoryControl.valueChanges.pipe(distinctUntilChanged(), debounceTime(FILTER_DEBOUNCE_MIN)),
    )
      .pipe(
        takeUntilDestroyed(),
        debounceTime(10),
        map(() => {
          const originalItems = this.originalItems$.value;
          // let items = originalItems ? this.role.filterItemRecords(originalItems) : undefined;
          let items = originalItems;
          items = items?.concat(this._recentOptionalItems);
          if (this.categoryControl.value !== undefined && this.categoryControl.value !== null) {
            items = items?.filter((t) => t.category === this.categoryControl.value);
          }

          this._selectionModel.setItems(items ?? []);
          const term = (this.filterControl.value ?? '').replace(/_/gi, '').toLowerCase();

          let result: SelectItem<T>[] | undefined = undefined;
          if (!items) {
            result = undefined;
          } else if (items.length === 0) {
            result = [];
          } else if (term.length < this.requiredCharactersForFilter) {
            result = [...items];
          } else {
            result = items.filter((t) => {
              const label = t.label.toLowerCase();
              const additional = t.additionalData?.toLowerCase();
              return this.filterStrategy === 'includes'
                ? label.includes(term) || (additional && additional.includes(term))
                : label.startsWith(term) || (additional && additional.startsWith(term));
            });
          }

          this._showingOptionalValue.set(false);
          if (this.optional && term.length > 0 && result && result.length === 0) {
            result.push({
              label: `${term}`,
              value: term as never,
              optional: true,
            });
            this._showingOptionalValue.set(true);
          }

          if (this.multiple && term.length === 0) {
            result?.unshift({
              label: $localize`:@@base.ui.select.selectAll:Select All`,
              value: undefined as never,
              type: 'selectAll',
            });
          }

          return result;
        }),
      )
      .subscribe((list) => {
        if (this.isClosing) return;
        this.filteredItems$.next(list);
        if (this.isOpening) {
          this.isOpening = false;
          this.updateFocusIndex();
        } else {
          this.setFocusIndex(list?.length ? list[0].value : undefined);
        }
      });
  }

  ngAfterViewInit() {
    this.trigger.menuClosed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.prepareClose();
    });
    this.trigger.menuOpened.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      setTimeout(() => {
        if (this._customInput) {
          this._customInput.focus();
        } else if (this.filterInputEl?.nativeElement) {
          this.filterInputEl.nativeElement.focus();
        } else {
          this.panelEl.nativeElement.focus();
        }
      }, 75);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['items']) {
      this.itemsUpdateSub?.unsubscribe();
      this.originalItems$.next(undefined);
      this._instanceOfItems = this.items instanceof Observable ? 'observable' : 'array';
      const updateItems$ = this.items
        ? (this.items instanceof Observable ? this.items : of(this.items)).pipe(
            tap(() => {
              this.originalItems$.next(undefined);
            }),
            tap((result) => {
              if (result instanceof Array) {
                this.originalItems$.next(result);
                this.setCurrentItemByValue(this._initialValue ?? this.control.value);
              }
            }),
          )
        : undefined;

      this.itemsUpdateSub = updateItems$ ? updateItems$.subscribe() : new Subscription();
    }
    if (changes['control']) {
      this.controlSub?.unsubscribe();
      this._initialValue = this.control.value;
      this.controlSub = this.control.valueChanges.pipe(startWith(this.control.value)).subscribe((value) => {
        if (this.trigger?.menuOpen && !!this._customInput) return;
        this.setCurrentItemByValue(value);
      });
      this.controlSub.add(
        this.control.status$.pipe(debounceTime(1)).subscribe((status) => {
          if (this.control.dirty) {
            this.filterControl.markAsDirty();
          }
          if (this.control.touched) {
            this.filterControl.markAsTouched();
          }
          if (status === 'INVALID' && (this.control.touched || this.control.dirty)) {
            this.filterControl.setValidators(this.control.validator);
          } else {
            this.filterControl.setValidators(null);
          }
          this.filterControl.updateValueAndValidity();
        }),
      );
    }
    if (changes['categories']) {
      this.categoriesUpdateSub?.unsubscribe();
      this.categories$.next(undefined);
      const updateItems$ = this.categories
        ? (this.categories instanceof Observable ? this.categories : of(this.categories)).pipe(
            tap(() => {
              this.categories$.next(undefined);
            }),
            tap((result) => {
              if (result instanceof Array) {
                this.categories$.next(result);
              }
            }),
          )
        : undefined;

      this.categoriesUpdateSub = updateItems$ ? updateItems$.subscribe() : new Subscription();
    }
  }

  ngOnDestroy() {
    this.controlSub?.unsubscribe();
    this.itemsUpdateSub?.unsubscribe();
    this.categoriesUpdateSub?.unsubscribe();
    this.customInputSub?.unsubscribe();
  }

  selectItem(item: SelectItem<T>, e?: MouseEvent) {
    e?.stopPropagation();
    e?.preventDefault();
    if (item.type) {
      this.invokeTypedItemAction(item);
      return;
    }
    if (this.currentItemControl.value?.value === item.value && !this.multiple) {
      this.close();
    }

    this.markAsDirty();
    this.setFocusIndex(item.value);

    if (this.multiple) {
      if (item.optional) {
        this._recentOptionalItems.push(item);
      }
      this._selectionModel.toggle(item);
      const items = this._selectionModel.selected() as any;
      this.currentItemControl.setValue(items);
      this.onMultiSelect.emit(items);
    } else {
      if (item.optional) {
        this._recentOptionalItems = [item];
      }
      this.isClosing = true;
      this.currentItemControl.setValue(item);
      this.onSelect.emit(item.value);
      this.close();
    }
  }

  selectFirstItem() {
    const visibleItems = this.filteredItems$.value;
    if (visibleItems && visibleItems.length > 0) {
      this.selectItem(visibleItems[0]);
    }
  }

  selectFocusedItem() {
    const item = this.indexToItem(this.currentFocusIndex());
    if (!item) {
      this.close();
      return;
    }
    this.selectItem(item);
  }

  open() {
    if (this.control.disabled) return;
    if (isFormControlExtended(this.control) && this.control.readonly) return;
    if (this.trigger.menuOpen) return;

    this.isClosing = false;
    this.isOpening = true;
    this.filterControl.reset();
    this.categoryControl.reset();
    this.updateSelectionModel();
    this.currentFocusIndex.set(this.itemToIndex(this.control.value));

    this.trigger.openMenu();

    // @ts-ignore
    const menuOverlayElement = this.trigger._overlayRef._pane as HTMLElement;
    (menuOverlayElement.children.item(0)! as HTMLElement).style.width = `${this.wrapperEl.nativeElement.offsetWidth}px`;

    setTimeout(() => {
      this.scrollToFocusedIndex();
      // this.scrollIntoSelectedOption();
    }, 8);

    // ... manual positioning of the menu
    setTimeout(() => {
      // @ts-ignore
      const overlay: OverlayRef = this.trigger._overlayRef;
      // @ts-ignore
      const positionStrategy: any = overlay._positionStrategy;
      positionStrategy._isInitialRender = true;
      positionStrategy.apply();
    }, 9);
  }

  close() {
    this.isClosing = true;
    this.trigger.closeMenu();
    this.prepareClose();
  }

  focusNextItem() {
    const length = (this.filteredItems$.value ?? []).length;
    let newIndex = this.currentFocusIndex() + 1;
    if (newIndex >= length) {
      newIndex = 0;
    }
    this.currentFocusIndex.set(newIndex);
    this.scrollToFocusedIndex();
  }
  focusPrevItem() {
    let newIndex = this.currentFocusIndex() - 1;
    if (newIndex === -1) {
      const length = (this.filteredItems$.value ?? []).length;
      newIndex = length - 1;
    }
    this.currentFocusIndex.set(newIndex);
    this.scrollToFocusedIndex();
  }

  onFilterKeyDown(e: KeyboardEvent) {
    if (!this.trigger.menuOpen) return;

    e.stopPropagation();

    if (e.key === 'Enter') {
      e.preventDefault();
      this.selectFocusedItem();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.focusPrevItem();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.focusNextItem();
    } else if (e.key === 'Escape') {
      this.close();
    } else if (e.key === 'Tab') {
      this.close();
    }
  }

  // We use to set a custom element for focussing after the menu is opened
  setElementToFocus(el: HTMLInputElement) {
    this.customInputSub?.unsubscribe();
    this._customInput = el;
    this.customInputSub = new Subscription();
    this.customInputSub.add(
      fromEvent<KeyboardEvent>(el, 'keydown').subscribe((e) => {
        this.onFilterKeyDown(e);
      }),
    );
    this.customInputSub.add(
      fromEvent(el, 'input').subscribe(() => {
        const value = 'actualValue' in el ? (el.actualValue as string) : el.value;
        this.filterControl.setValue(value);
      }),
    );
  }

  private invokeTypedItemAction(item: SelectItem<T>) {
    this.markAsDirty();

    if (item.type === 'selectAll') {
      this._selectionModel.toggleAll();
      const items = this._selectionModel.selected() as any;
      this.currentItemControl.setValue(items);
      this.onMultiSelect.emit(items);
    }
  }

  private scrollToFocusedIndex() {
    if (!this.containerEl?.nativeElement) return;

    const container = this.containerEl.nativeElement;
    const childrenCount = container.children.length;
    const focusedEl = container.children.item(this.currentFocusIndex()) as HTMLDivElement;
    if (this.currentFocusIndex() >= childrenCount) {
      container.scrollTop = container.scrollHeight;
    } else if (focusedEl && container.scrollHeight > container.clientHeight) {
      container.scrollTop = focusedEl.offsetTop - 160;
    }
  }

  private setFocusIndex(value: T | undefined | null) {
    if (value !== undefined) {
      this.currentFocusIndex.set(this.itemToIndex(value));
    } else {
      this.currentFocusIndex.set(0);
    }
  }

  // This is used when the visible list is updated, and the indexes are recalculated
  private updateFocusIndex() {
    const currentValue = this.control.value;
    this.setFocusIndex(currentValue);
  }

  private itemToIndex(value: T | null) {
    const items = this.filteredItems$.value ?? [];
    const index = items.findIndex((t) => t.value === value);
    return index >= 0 ? index : 0;
  }

  private indexToItem(index: number) {
    if (index < 0) return undefined;
    const items = this.filteredItems$.value ?? [];
    return items.at(index);
  }

  private prepareClose() {
    this.isClosing = true;
    this.markAsTouched();
    const currentValue = this.control.value;

    if (this.multiple) {
      const newValue = this._selectionModel.selected().map((t) => t.value);
      if (currentValue instanceof Array) {
        if (!arraysEqual(currentValue, newValue)) {
          this.control.setValue(newValue);
        }
      } else {
        this.control.setValue(newValue);
      }
    } else {
      const newValue = this.currentItemControl.value?.value;
      if (currentValue !== newValue) {
        this.control.setValue(newValue);
      }
    }

    if (this._customInput) {
      this._customInput.blur();
    }

    this.menuClosed.emit();
    this.isClosing = false;
  }

  private setCurrentItemByValue(value: T | null | undefined, emitEvent = true) {
    let currentValue: any = this.valueTypeTransform(value);
    let currentItem: any;
    const items = [...(this.originalItems$.value ?? []), ...this._recentOptionalItems];

    if (value instanceof Array) {
      currentValue = this.multiple ? value : value.length ? value[0] : undefined;
    } else {
      currentValue = this.multiple && value !== undefined ? [value] : value;
    }

    if (this.multiple && currentValue !== undefined) {
      currentItem = [];
      for (const val of currentValue as any[]) {
        const item = items.find((t) => t.value === val);
        if (item) {
          currentItem.push(item);
        }
      }
      // currentItem = items.filter((t) => currentValue?.includes(t.value));
      if (currentItem.length === 0) currentItem = undefined;
    } else {
      currentItem = items.find((t) => t.value === currentValue);
    }

    if ((currentValue === null || currentValue === undefined || currentValue?.length === 0) && !currentItem) {
      this.currentItemControl.setValue(value as null, { emitEvent });
      return;
    }
    this.setFocusIndex(this.multiple ? currentValue?.at(0) : currentValue);
    this.currentItemControl.setValue(currentItem, { emitEvent });
    if (this.originalItems$.value !== undefined) {
      this._initialValue = undefined;
    }
  }

  private updateSelectionModel() {
    if (!this.multiple) return;

    this._selectionModel.set(...(this.currentItemControl.value ?? ([] as any)));
  }

  private markAsTouched() {
    this.control.markAsTouched();
    this.filterControl.markAsTouched();
    this.control.emitStatus();
  }

  private markAsDirty() {
    this.control.markAsDirty();
    this.filterControl.markAsDirty();
    this.control.emitStatus();
  }

  // Based on 'multiple' property, we convert our value between Array and Pure: T <=> T[]
  private valueTypeTransform(value: T | (T | null)[] | null | undefined) {
    if (value instanceof Array) {
      return this.multiple ? value : value.length ? value[0] : undefined;
    } else {
      return this.multiple && value !== undefined ? [value] : value;
    }
  }
}
