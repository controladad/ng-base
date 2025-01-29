import { Component, Input } from '@angular/core';
import { FilterItem, FilterModel } from '../../../../classes';
import { ButtonComponent, ChipsComponent, IconComponent } from '../../../ui';


@Component({
  selector: 'feature-table-filter-bar',
  standalone: true,
  imports: [ButtonComponent, ChipsComponent, IconComponent],
  templateUrl: './table-filter-bar.component.html',
  styleUrls: ['./table-filter-bar.component.scss'],
})
export class TableFilterBarComponent {
  @Input() filterModel?: FilterModel;

  removeFilter(item: FilterItem) {
    this.filterModel?.remove(item.prop);
  }

  clearFilters() {
    this.filterModel?.clear();
  }
}
