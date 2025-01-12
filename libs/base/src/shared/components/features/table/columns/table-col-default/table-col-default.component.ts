import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { TableColBase } from '../_table_col_base';
import { TableColumnData, TableRow } from '../../table.component';
import { AsyncPipe, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ButtonComponent, LicensePlateComponent } from '../../../../ui';
import { MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef } from '@angular/material/table';
import { TableFilterComponent } from '../../table-filter/table-filter.component';
import { TableSortComponent } from '../../table-sort/table-sort.component';
import { TypeofPipe } from '../../../../../pipes';

@Component({
  selector: 'feature-table-col-default',
  imports: [
    AsyncPipe,
    ButtonComponent,
    LicensePlateComponent,
    MatCell,
    MatCellDef,
    MatHeaderCell,
    TableFilterComponent,
    TableSortComponent,
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
export class TableColDefaultComponent extends TableColBase implements OnInit {
  @Input() col!: TableColumnData<any>;

  @Output() onRowClick = new EventEmitter<TableRow<any>>();

  override ngOnInit() {
    this.prop = this.col.prop;
    super.ngOnInit();
  }
}
