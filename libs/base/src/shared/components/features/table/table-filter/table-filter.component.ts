import { ChangeDetectionStrategy, Component, computed, Input } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';

import { CacTableFilterMenuComponent } from '../table-filter-menu/table-filter-menu.component';
import { CacIconComponent } from '../../../ui';
import { TableColumnData } from '../table.component';
import { TableFilterModel } from '../../../../classes';

@Component({
  selector: 'cac-table-filter',
  standalone: true,
  imports: [CacIconComponent, MatMenuModule, CacTableFilterMenuComponent],
  templateUrl: './table-filter.component.html',
  styleUrls: ['./table-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CacTableFilterComponent<T> {
  @Input() column!: TableColumnData<T>;
  @Input() filterModel!: TableFilterModel;

  isActive = computed(() => {
    const filters = this.filterModel.filters();
    if (!filters) return false;

    return filters[this.column.prop];
  });
}
