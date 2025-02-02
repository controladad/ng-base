import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CacTableColBase } from '../_table_col_base';
import { TableColumnData, TableRow } from '../../table.component';
import { AsyncPipe, NgStyle, NgTemplateOutlet } from '@angular/common';
import { CacButtonComponent, CacLicensePlateComponent } from '../../../../ui';
import { MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef } from '@angular/material/table';
import { CacTableFilterComponent } from '../../table-filter/table-filter.component';
import { CacTableSortComponent } from '../../table-sort/table-sort.component';
import { TypeofPipe } from '../../../../../pipes';

@Component({
  selector: 'cac-table-col-default',
  imports: [
    AsyncPipe,
    CacButtonComponent,
    CacLicensePlateComponent,
    MatCell,
    MatCellDef,
    MatHeaderCell,
    CacTableFilterComponent,
    CacTableSortComponent,
    MatColumnDef,
    NgStyle,
    NgTemplateOutlet,
    TypeofPipe,
    MatHeaderCellDef,
  ],
  templateUrl: './table-col-default.component.html',
  styleUrl: './table-col-default.component.scss',
  standalone: true,
})
export class CacTableColDefaultComponent extends CacTableColBase implements OnInit {
  @Input() col!: TableColumnData<any>;

  @Output() onRowClick = new EventEmitter<TableRow<any>>();

  override ngOnInit() {
    this.prop = this.col.prop;
    super.ngOnInit();
  }
}
