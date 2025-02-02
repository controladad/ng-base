import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { CacTableColBase } from '../_table_col_base';
import { MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef } from '@angular/material/table';
import { MatMenuTrigger } from '@angular/material/menu';
import { AsyncPipe } from '@angular/common';
import { ButtonClickEvent, CacButtonComponent } from '../../../../ui';
import { PermissionHideDirective } from '../../../../../directives';
import { MatBadge } from '@angular/material/badge';
import { TableAction } from '../../table.interfaces';
import { BehaviorSubject, Subject, take } from 'rxjs';

export const TABLE_COL_ACTION_PROP = '___action';

@Component({
  selector: 'cac-table-col-action',
  imports: [
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCellDef,
    MatCell,
    MatMenuTrigger,
    CacButtonComponent,
    PermissionHideDirective,
    MatBadge,
    AsyncPipe,
  ],
  templateUrl: './table-col-action.component.html',
  styleUrl: './table-col-action.component.scss',
  standalone: true,
})
export class CacTableColActionComponent extends CacTableColBase implements AfterViewInit {
  override prop = TABLE_COL_ACTION_PROP;

  @ViewChildren('ActionColCells') actionColCells?: QueryList<ElementRef<HTMLDivElement>>;

  @Input() actions!: TableAction<any>[];

  @Output() onAction = new EventEmitter<{
    action: TableAction<any>;
    row: any;
    trigger: MatMenuTrigger;
    clickEvent: ButtonClickEvent;
  }>();

  onVisible$ = new Subject<boolean>();

  ngAfterViewInit() {
    this.actionColCells?.changes.pipe(take(1)).subscribe(() => {
      const isVisible = this.actionColCells?.some((wrapper) =>
        Array.from(wrapper.nativeElement.children).some((el) => el.clientWidth !== 0),
      );
      this.onVisible$.next(isVisible ?? false);
    });
  }
}
