import {
  AfterViewInit,
  Component,
  DestroyRef,
  inject,
  Input,
  OnChanges,
  QueryList,
  signal,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { NgLetDirective } from '../../../directives';
import { of, Subject, switchMap, take, combineLatest } from 'rxjs';
import { AlxPrintDirective, AlxPrintModule } from '@al00x/printer';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface PrintableTableData {
  header: string[];
  rows: string[][];
  extra?: { value: string | number; label: string }[];
}

@Component({
  selector: 'feature-printable-table',
  standalone: true,
  imports: [NgFor, NgIf, NgLetDirective, AlxPrintModule],
  templateUrl: './printable-table.component.html',
  styleUrls: ['./printable-table.component.scss'],
})
export class PrintableTableComponent implements OnChanges, AfterViewInit {
  readonly destroyRef = inject(DestroyRef);

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
    }
  }

  ngAfterViewInit() {
    combineLatest([this.cols.changes, this.rows.changes, this.headers.changes])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        setTimeout(() => {
          this.rendered$.next(null);
        }, 100);
      });
  }

  render(data: PrintableTableData) {
    this._currentData.set(data);
    return this.rendered$.pipe(take(1));
  }

  // Render and print
  print(data: PrintableTableData) {
    return this.render(data).pipe(
      switchMap(() => {
        // this.printer.cleanup();
        // this.printer.prepare();
        // window.print();
        this.printer.print();
        return of(null);
      }),
    );
  }
}
