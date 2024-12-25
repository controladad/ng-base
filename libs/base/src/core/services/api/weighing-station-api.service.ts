import { Injectable } from '@angular/core';
import { BaseApi } from './_base-api';
import { WeighingStationCreate, WeighingStationEntity, WeighingStationUpdate } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class WeighingStationApiService extends BaseApi<
  WeighingStationEntity,
  WeighingStationCreate,
  WeighingStationUpdate
> {
  constructor() {
    super('WeighingStation');
  }

  getItems() {
    return this.getItemRecords((t) => ({ label: t.stationName, value: t.id }));
  }
}
