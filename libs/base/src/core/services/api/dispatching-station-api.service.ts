import { Injectable } from '@angular/core';
import { DispatchingStationCreate, DispatchingStationEntity, DispatchingStationUpdate } from '../../models';
import { BaseApi } from './_base-api';

@Injectable({
  providedIn: 'root',
})
export class DispatchingStationApiService extends BaseApi<
  DispatchingStationEntity,
  DispatchingStationCreate,
  DispatchingStationUpdate
> {
  constructor() {
    super('/DispatchingStation');
  }

  getItems() {
    return super.getItemRecords('name');
  }
}
