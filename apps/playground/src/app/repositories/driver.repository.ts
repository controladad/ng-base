import { BaseApi, formBuilder } from '@controladad/ng-base';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { formControl } from '@al00x/forms';

export interface DriverEntity {
  id: number;
  name: string;
  class: string;
  team: string;
  car: string;
  talented: boolean;
}

export interface DriverCreate {
  name: string;
  class: string;
  team: string;
  car: string;
  talented: boolean;
}

export type DriverUpdate = Partial<
  DriverCreate & {
    id: number;
    transfer: boolean;
  }
>;

@Injectable({
  providedIn: 'root',
})
export class DriverApi extends BaseApi<DriverEntity, DriverCreate, DriverUpdate> {
  constructor() {
    super('/Drivers');
  }

  // @ts-ignore
  override getAll(): Observable<DriverEntity[]> {
    return of([
      {
        id: 1,
        name: 'Lewis Hamilton',
        class: 'Mercedes',
        team: 'Silver',
        car: 'S250',
        talented: true,
      },
      {
        id: 2,
        name: 'Sebastian Vettel',
        class: 'Ferrari',
        team: 'Red',
        car: 'F24',
        talented: true,
      },
      {
        id: 3,
        name: 'Valtteri Bottas',
        class: 'BWM',
        team: 'Blue',
        car: 'B45',
        talented: false,
      },
    ] as DriverEntity[]);
  }
}

export class DriverRepository {
  static api: DriverApi;

  static form = (values?: any) => formBuilder({
    cols: 2,
    values: values,
    inputs: {
      name: {
        control: formControl(''),
        label: 'نام',
      },
      class: {
        control: formControl(''),
        label: 'کلاس',
      },
      team: {
        control: formControl(''),
        label: 'تیم',
      },
      car: {
        control: formControl(''),
        label: 'ماشین',
      },
    },
  });

  static init() {
    this.api = inject(DriverApi);
  }

  static dialog(data?: DriverEntity, opts?: {

  }) {
    return dialog$.input({
      title: 'Driver',
      formBuilder: this.form(data),
    })
  }

  static dialogCreate() {
    return this.dialog();
  }
}
