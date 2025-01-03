import { Component, computed, EventEmitter, Input, OnChanges, Output, signal, SimpleChanges } from '@angular/core';
import { DecimalPipe, NgClass, NgForOf, NgIf, NgTemplateOutlet } from '@angular/common';
import { distinctUntilChanged, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ScreenDetectorService } from '@al00x/screen-detector';
import { MatIconModule } from '@angular/material/icon';
import { IconComponent } from '../icon';
import { FieldComponent } from '../field';
import { ButtonComponent } from '../button';
import { ItemRecord } from '../../../../core';
import { formControl } from '../../../forms';

export interface PaginationEvent {
  index: number;
  page: number;
  size: number;
}

interface PageItem {
  number: number;
  jump?: boolean;
}

@Component({
  selector: 'ui-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  standalone: true,
  imports: [
    IconComponent,
    NgIf,
    NgClass,
    NgForOf,
    NgTemplateOutlet,
    IconComponent,
    FieldComponent,
    DecimalPipe,
    ButtonComponent,
    MatIconModule,
  ],
})
export class PaginationComponent implements OnChanges {
  protected _total = signal<number>(0);
  @Input() set total(value: number) {
    this._total.set(value);
  }
  private _sizeProp = signal<number | undefined>(undefined);
  @Input('size') set sizeProp(value: number | undefined) {
    this._sizeProp.set(value);
  }
  @Input() index?: number;
  @Input() autoHide = false;

  @Output() onIndex = new EventEmitter<number>();
  @Output() onUpdate = new EventEmitter<PaginationEvent>();

  pageSizesList: ItemRecord<number>[] = [
    { label: '10', value: 10 },
    { label: '25', value: 25 },
    { label: '50', value: 50 },
    { label: '100', value: 100 },
  ];

  private _currentSizeControlValue = signal<number | null>(null);
  protected currentSizeControl = formControl<number>(10);

  visibleCount = signal(10);
  selectedIndex = signal(0);
  size = computed(() => this._sizeProp() ?? this._currentSizeControlValue() ?? 0);
  page = computed(() => this.selectedIndex() + 1);
  totalPages = computed(() => {
    const count = Math.ceil((this._total() ?? 0) / (this.size() ?? 1));
    return count > 0 ? count : 1;
  });
  startIndex = computed(() => this.selectedIndex() * this.size());
  protected showLeftEllipsis = computed(() => {
    try {
      return this.pagesArray()[1].number > 2;
    } catch {
      return false;
    }
  });
  protected showRightEllipsis = computed(() => {
    try {
      return this.pagesArray()[this.pagesArray().length - 2].number < this.totalPages() - 1;
    } catch {
      return false;
    }
  });
  protected pagesArray = computed(() => {
    const pages: PageItem[] = [];
    const sideCount = (this.visibleCount() - 1) / 2;
    let visibleLowRange = this.page() - Math.ceil(sideCount);
    let visibleHighRange = this.page() + Math.floor(sideCount);
    if (visibleLowRange < 1) {
      while (visibleLowRange < 1) {
        visibleLowRange++;
        visibleHighRange++;
      }
      if (visibleHighRange > this.totalPages()) {
        visibleHighRange = this.totalPages();
      }
    } else if (visibleHighRange > this.totalPages()) {
      while (visibleHighRange > this.totalPages()) {
        visibleLowRange--;
        visibleHighRange--;
      }
      if (visibleLowRange < 1) {
        visibleLowRange = 1;
      }
    }

    for (let i = visibleLowRange; i <= visibleHighRange; i++) {
      pages.push({ number: i });
    }
    if (!pages.some((t) => t.number === 1)) {
      pages.shift();
      pages.unshift({ number: 1 });
    }
    if (!pages.some((t) => this.totalPages() === t.number)) {
      pages.pop();
      pages.push({ number: this.totalPages() });
    }

    return pages;
  });

  constructor(private screen: ScreenDetectorService) {
    this.currentSizeControl.valueChanges
      .pipe(takeUntilDestroyed(), startWith(this.currentSizeControl.value), distinctUntilChanged())
      .subscribe((value) => {
        this._currentSizeControlValue.set(value);
        this.emitUpdate();
      });
    this.screen.state$.pipe(takeUntilDestroyed()).subscribe((state) => {
      this.visibleCount.set(state.lg ? 12 : state.md ? 10 : state.sm ? 8 : 6);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['index'] && this.index !== undefined) {
      this.selectedIndex.set(this.index);
    }
  }

  next() {
    if (this.index === this.totalPages()) {
      return;
    }
    this.setPage(this.page() + 1);
  }
  previous() {
    if (this.page() === 1) {
      return;
    }
    this.setPage(this.page() - 1);
  }

  set(index: number) {
    return this.setPage(index + 1);
  }

  setPage(page: number) {
    const newIndex = page - 1;
    this.selectedIndex.set(newIndex);
    this.emitUpdate();
  }

  protected onSelect(page: PageItem) {
    this.setPage(page.number);
  }

  private emitUpdate() {
    this.onIndex.emit(this.selectedIndex());
    this.onUpdate.emit({
      index: this.selectedIndex(),
      page: this.selectedIndex() + 1,
      size: this.size(),
    });
  }
}
