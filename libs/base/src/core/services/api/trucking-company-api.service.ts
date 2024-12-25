import { Injectable } from '@angular/core';
import { BaseApi } from './_base-api';
import { TruckingCompanyCreate, TruckingCompanyEntity, TruckingCompanyUpdate } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class TruckingCompanyApiService extends BaseApi<
  TruckingCompanyEntity,
  TruckingCompanyCreate,
  TruckingCompanyUpdate
> {
  constructor() {
    super('TruckingCompany');
  }

  getItems(branchIds?: number | number[]) {
    return super.getItemRecords('truckingCompanyName', true, [{ key: 'BranchIds', value: branchIds }]);
  }
}
