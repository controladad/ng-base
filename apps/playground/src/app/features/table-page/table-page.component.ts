import { Component } from '@angular/core';
import { GetOfflineAdapter, table, CacTableComponent, formBuilder, formControl } from '@controladad/ng-base';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-table-page',
  imports: [CacTableComponent],
  templateUrl: './table-page.component.html',
  styleUrl: './table-page.component.scss',
})
export class TablePageComponent {
  formBuilder = formBuilder({
    cols: 2,
    inputs: {
      name: {
        control: formControl(),
        label: 'Name',
      },
    },
  });

  table = table({
    itemsFn: GetOfflineAdapter(
      of([
        { id: 1, name: 'Sebastian Vettel', class: 'Ferrari', team: 'Red', car: 'F24', talented: true, transfer: false },
        { id: 2, name: 'Lewis Hamilton', class: 'Mercedes', team: 'Blue', car: 'W13', talented: true, transfer: false },
        {
          id: 3,
          name: 'Max Verstappen',
          class: 'Red Bull Racing',
          team: 'Silver',
          car: 'RB18',
          talented: true,
          transfer: false,
        },
        {
          id: 4,
          name: 'Valtteri Bottas',
          class: 'Ferrari',
          team: 'Silver',
          car: 'F1',
          talented: true,
          transfer: false,
        },
        {
          id: 5,
          name: 'Charles Leclerc',
          class: 'Ferrari',
          team: 'Yellow',
          car: 'F1',
          talented: true,
          transfer: false,
        },
        {
          id: 6,
          name: 'Lance Stroll',
          class: 'Aston Martin',
          team: 'Blue',
          car: 'AMR22',
          talented: true,
          transfer: false,
        },
        { id: 7, name: 'Pierre Gasly', class: 'Alpine', team: 'Red', car: 'A22', talented: true, transfer: false },
        { id: 8, name: 'Sebastian Vettel', class: 'Ferrari', team: 'Red', car: 'F1', talented: true, transfer: false },
      ]).pipe(delay(1500)),
    ),
    // view: { itemName: 'Driver' },
    selectable: true,
    showIndex: true,
    columns: {
      id: { label: 'ردیف' },
      name: { label: 'نام', filterable: 'FullName' },
      class: { label: 'کلاس' },
      team: { label: 'تیم' },
      car: { label: 'ماشین' },
      talented: { label: 'ویژه', type: 'boolean' },
      transfer: { label: 'ترانسفر', type: 'boolean' },
    },
    actions: [
      {
        type: 'button',
        content: 'EDIT',
        action: (item) =>
          dialog$.crud({ formBuilder: this.formBuilder, value: item }).afterSubmit(),
      },
      { type: 'icon', content: 'trash', action: (item) => console.log(item) },
    ],
  });
}
