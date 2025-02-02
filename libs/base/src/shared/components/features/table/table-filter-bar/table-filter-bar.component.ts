import { Component, Input } from '@angular/core';
import { FilterItem, FilterModel } from '../../../../classes';
import { CacButtonComponent, CacChipsComponent, CacIconComponent } from '../../../ui';


@Component({
  selector: 'cac-table-filter-bar',
  standalone: true,
  imports: [CacButtonComponent, CacChipsComponent, CacIconComponent],
  templateUrl: './table-filter-bar.component.html',
  styleUrls: ['./table-filter-bar.component.scss'],
})
export class CacTableFilterBarComponent {
  @Input() filterModel?: FilterModel;

  removeFilter(item: FilterItem) {
    this.filterModel?.remove(item.prop);
  }

  clearFilters() {
    this.filterModel?.clear();
  }
}
