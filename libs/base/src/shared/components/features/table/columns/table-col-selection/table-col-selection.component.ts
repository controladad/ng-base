import { Component, EventEmitter, Output } from '@angular/core';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef
} from '@angular/material/table';
import { CacCheckboxComponent } from '../../../../ui';
import { CacTableColBase } from '../_table_col_base';

export const TABLE_COL_SELECTION_PROP = '___selection';

@Component({
  selector: 'cac-table-col-selection',
  imports: [CacCheckboxComponent, MatCell, MatHeaderCell, MatColumnDef, MatCellDef, MatHeaderCellDef],
  templateUrl: './table-col-selection.component.html',
  styleUrl: './table-col-selection.component.scss',
  standalone: true,
})
export class CacTableColSelectionComponent extends CacTableColBase {
  override prop = TABLE_COL_SELECTION_PROP;

  @Output() onSelect = new EventEmitter<{ row: any; state: boolean }>();
  @Output() onSelectAll = new EventEmitter<boolean>();
}
