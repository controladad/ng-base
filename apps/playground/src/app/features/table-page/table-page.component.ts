import { Component } from '@angular/core';
import { GetOfflineAdapter, table, TableComponent } from '@controladad/ng-base';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-table-page',
  imports: [TableComponent],
  templateUrl: './table-page.component.html',
  styleUrl: './table-page.component.scss',
})
export class TablePageComponent {
  table = table({
    itemsFn: GetOfflineAdapter(of([
      { id: 1, name: 'Sebastian Vettel', class: 'Ferrari', team: 'Red', car: 'F24', talented: true, transfer: false },
      { id: 2, name: 'Lewis Hamilton', class: 'Mercedes', team: 'Blue', car: 'W13', talented: true, transfer: false },
      { id: 3, name: 'Max Verstappen', class: 'Red Bull Racing', team: 'Silver', car: 'RB18', talented: true, transfer: false },
      { id: 4, name: 'Valtteri Bottas', class: 'Ferrari', team: 'Silver', car: 'F1', talented: true, transfer: false },
      { id: 5, name: 'Charles Leclerc', class: 'Ferrari', team: 'Yellow', car: 'F1', talented: true, transfer: false },
      { id: 6, name: 'Lance Stroll', class: 'Aston Martin', team: 'Blue', car: 'AMR22', talented: true, transfer: false },
      { id: 7, name: 'Pierre Gasly', class: 'Alpine', team: 'Red', car: 'A22', talented: true, transfer: false },
      { id: 8, name: 'Sebastian Vettel', class: 'Ferrari', team: 'Red', car: 'F1', talented: true, transfer: false },
    ]).pipe(delay(1500))),
    pagination: { size: 25, },
    selectable: true,
    showIndex: true,
    columns: {
      id: {  label: 'ردیف' },
      name: { label: 'نام' },
      class: { label: 'کلاس'},
      team: { label: 'تیم'},
      car: { label: 'ماشین' },
      talented: { label: 'ویژه', type: 'boolean' },
      transfer: { label: 'ترانسفر', type: 'boolean' },
    },
    actions: [
      { type: 'button', content: 'CLICK', action: (item) => console.log(item) },
      { type: 'icon', content: 'trash', action: (item) => console.log(item) },
    ]
  })
}
