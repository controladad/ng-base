import { Injectable } from '@angular/core';
import { BaseApi } from './_base-api';
import {
  ShipmentOrderCreate,
  ShipmentOrderEntity,
  ShipmentOrderUpdate,
  ShipmentOrderWithTotalweight,
} from '../../models';

@Injectable({
  providedIn: 'root',
})
export class ShipmentOrderApiService extends BaseApi<ShipmentOrderEntity, ShipmentOrderCreate, ShipmentOrderUpdate> {
  constructor() {
    super('ShipmentOrder');
  }

  getShipmentOrderWithTotalweight() {
    return http$.get<ShipmentOrderWithTotalweight>('/ShipmentOrdersWithTotalWeight');
  }

  getItems(branchIds?: number | number[], truckingCompanyName?: string) {
    return super.getItemRecords('shipmentOrderNumber', true, [
      { key: 'BranchIDs', value: branchIds },
      { key: 'TruckingCompanyName', value: truckingCompanyName },
    ]);
  }
}
