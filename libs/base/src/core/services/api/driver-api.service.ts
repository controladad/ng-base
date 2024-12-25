import { Injectable } from '@angular/core';
import { BaseApi } from './_base-api';
import { DriverCreate, DriverEntity, DriverUpdate } from '../../models';
import { getFullName } from '../../helpers';

@Injectable({
  providedIn: 'root',
})
export class DriverApiService extends BaseApi<DriverEntity, DriverCreate, DriverUpdate> {
  constructor() {
    super('Driver');
  }

  getItems() {
    return super.getItemRecords((t) => getFullName(t));
  }
}
