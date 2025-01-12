import { Component, Input } from '@angular/core';
import { TableColBase } from '../_table_col_base';
import { MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef } from '@angular/material/table';

export const TABLE_COL_INDEX_PROP = '___index';

@Component({
  selector: 'feature-table-col-index',
  imports: [MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell],
  templateUrl: './table-col-index.component.html',
  styleUrl: './table-col-index.component.scss',
  standalone: true,
})
export class TableColIndexComponent extends TableColBase {
  override prop = TABLE_COL_INDEX_PROP;

  @Input() startIndex = 0;
}
