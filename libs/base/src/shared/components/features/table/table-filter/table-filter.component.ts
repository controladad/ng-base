import { ChangeDetectionStrategy, Component, computed, Input } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { NgIf } from '@angular/common';
import { TableFilterMenuComponent } from '../table-filter-menu/table-filter-menu.component';
import { IconComponent } from '../../../ui';
import { TableColumnData } from '../table.component';
import { TableFilterModel } from '../../../../classes';

@Component({
  selector: 'feature-table-filter',
  standalone: true,
  imports: [IconComponent, MatMenuModule, TableFilterMenuComponent, NgIf],
  templateUrl: './table-filter.component.html',
  styleUrls: ['./table-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableFilterComponent<T> {
  @Input() column!: TableColumnData<T>;
  @Input() filterModel!: TableFilterModel;

  isActive = computed(() => {
    const filters = this.filterModel.filters();
    if (!filters) return false;

    return filters[this.column.prop];
  });
}
