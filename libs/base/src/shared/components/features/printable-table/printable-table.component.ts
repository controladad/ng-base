import {
  AfterViewInit,
  AfterViewChecked,
  Component,
  DestroyRef,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  QueryList,
  signal,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';

import { of, Subject, switchMap, take, combineLatest, delay } from 'rxjs';
import { AlxPrintDirective, AlxPrintModule } from '@al00x/printer';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface PrintableTableData {
  header: string[];
  rows: string[][];
  extra?: { value: string | number; label: string }[];
}

@Component({
  selector: 'cac-printable-table',
  standalone: true,
  imports: [AlxPrintModule],
  templateUrl: './printable-table.component.html',
  styleUrls: ['./printable-table.component.scss'],
})
export class CacPrintableTableComponent implements OnChanges, AfterViewInit, AfterViewChecked, OnDestroy {
  readonly destroyRef = inject(DestroyRef);

  private _pendingRender = false;

  @ViewChild('Printer') printer!: AlxPrintDirective;

  @ViewChildren('Headers') headers!: QueryList<any>;
  @ViewChildren('Rows') rows!: QueryList<any>;
  @ViewChildren('Cols') cols!: QueryList<any>;
  @ViewChildren('Extras') extras!: QueryList<any>;

  @Input() data?: PrintableTableData;

  rendered$ = new Subject<null>();
  protected _currentData = signal<PrintableTableData | undefined>(undefined);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this._currentData.set(this.data);
      this._pendingRender = true;
    }
  }

  ngAfterViewInit() {
    this._pendingRender = true;

    combineLatest([this.cols.changes, this.rows.changes, this.headers.changes])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this._pendingRender = true;
      });
  }

  ngAfterViewChecked() {
    if (this._pendingRender) {
      this._pendingRender = false;
      this.rendered$.next(null);
    }
  }

  ngOnDestroy() {
    this.printer?.cleanup();
  }

  render(data: PrintableTableData) {
    this._currentData.set(data);
    this._pendingRender = true;
    return this.rendered$.pipe(take(1));
  }

  // Render and print
  print(data: PrintableTableData) {
    this.printer.cleanup();

    return this.render(data).pipe(
      delay(0),
      switchMap(() => {
        try {
          this.printer.print();
          return of(null);
        } catch (error) {
          console.error('Print error:', error);
          this.printer.cleanup();
          throw error;
        }
      })
    );
  }
}
