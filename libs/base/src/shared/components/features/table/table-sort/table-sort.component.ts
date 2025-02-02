import { Component, Input, OnInit } from '@angular/core';
import { TableColumnData } from '../table.component';
import { SortModel } from '../../../../classes';

import { CacIconComponent } from '../../../ui';

@Component({
  selector: 'cac-table-sort',
  templateUrl: './table-sort.component.html',
  styleUrls: ['./table-sort.component.scss'],
  standalone: true,
  imports: [CacIconComponent],
})
export class CacTableSortComponent<T> implements OnInit {
  @Input() column!: TableColumnData<T>;
  @Input() sortModel!: SortModel;

  key = '';

  ngOnInit() {
    this.key =
      typeof this.column.sortable === 'string' && this.column.sortable !== '' ? this.column.sortable : this.column.prop;
  }

  onSortClick() {
    if (!this.column.sortable) return;

    if (this.sortModel.key() === this.key) {
      if (this.sortModel.direction() === 'desc') {
        this.sortModel.setDirection('asc');
      } else if (this.sortModel.direction() === 'asc') {
        this.sortModel.setKey(undefined);
      }
    } else {
      this.sortModel.setDirection('desc');
      this.sortModel.setKey(this.key);
    }
  }
}
