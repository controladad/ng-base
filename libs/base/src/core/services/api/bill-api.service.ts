import { Injectable } from '@angular/core';
import { BaseApi } from './_base-api';
import {
  BillCreate,
  BillEntity,
  BillSetArrivalTime,
  BillSetDeliveryConfirmation,
  BillSetDeliveryTime,
  BillUpdate,
  BillUpdateStatus,
} from '../../models';
import { DataGetRequest } from '../../interfaces';

@Injectable({
  providedIn: 'root',
})
export class BillApiService extends BaseApi<BillEntity, BillCreate, BillUpdate> {
  constructor() {
    super('/Bill', {
      get: 'Bills',
    });
  }

  getAdapterForEntezamat(branchIds?: number | number[]) {
    return this.getAdapter({
      default: {
        filters: [
          { key: 'BranchIDs', value: branchIds },
          { key: 'AdminStatus', value: 'Pending' },
          { key: 'BillStatus', value: 'SecondaryWeighing' },
        ],
      },
    });
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

  updateSecondWeight(model: BillUpdate) {
    return http$.put<any>('/Bill/SetSecondaryWeightOfBill', model);
  }

  confirmBillDelivery(model: BillSetDeliveryConfirmation) {
    return http$.put(`/Bill/DeliveryConfirmation`, model);
  }

  updateStatus(model: BillUpdateStatus) {
    return http$.put('/Bill/SetAdminStatusOfBill', model);
  }

  setArrivalTime(model: BillSetArrivalTime) {
    return http$.put('/Bill/SetArrivalTimeForBill', model);
  }

  setDeliveryTime(model: BillSetDeliveryTime) {
    return http$.put('/Bill/SetDeliveryTimeForBill', model);
  }

  setDeliveryConfirmation(model: BillSetDeliveryConfirmation) {
    return http$.put('/Bill/DeliveryConfirmation', model);
  }

  export(query?: DataGetRequest) {
    return super.exportAndDownload('/excel_export', query, 'main-bills');
  }
}
