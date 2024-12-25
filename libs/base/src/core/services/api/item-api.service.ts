import { Injectable } from '@angular/core';
import { BaseApi } from './_base-api';
import { ItemCreate, ItemEntity, ItemUpdate } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class ItemApiService extends BaseApi<ItemEntity, ItemCreate, ItemUpdate> {
  constructor() {
    super('Item');
  }

  getItems() {
    return super.getItemRecords('itemName');
  }
}
