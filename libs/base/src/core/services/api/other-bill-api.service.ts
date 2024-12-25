import { Injectable } from '@angular/core';
import { BaseApi } from './_base-api';
import { OtherBillCreate, OtherBillEntity, OtherBillSetSecondaryWeight, OtherBillUpdate } from '../../models';
import { DataGetRequest } from '../../interfaces';

@Injectable({
  providedIn: 'root',
})
export class OtherBillApiService extends BaseApi<OtherBillEntity, OtherBillCreate, OtherBillUpdate> {
  constructor() {
    super('/OtherItemBill');
  }

  getRecent(count: number) {
    return this.getAll({
      pagination: {
        page: 1,
        size: count,
      },
      sort: {
        key: 'DateTimeOfInitialWeight',
        direction: 'desc',
      },
    });
  }

  updateSecondWeight(model: OtherBillUpdate) {
    return http$.put<any>('/OtherItemBill/SetSecondaryWeightOfOtherItemBill', model);
  }

  setSecondaryWeight(model: OtherBillSetSecondaryWeight) {
    return http$.put('/Bill/SetSecondaryWeightOfOtherItemBill', model);
  }

  export(query?: DataGetRequest) {
    return super.exportAndDownload('/other_item-excel_export', query, 'other-bills');
  }
}
