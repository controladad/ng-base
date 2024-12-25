import { Injectable } from '@angular/core';
import { BaseApi } from './_base-api';
import { BranchCreate, BranchEntity, BranchUpdate } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class BranchApiService extends BaseApi<BranchEntity, BranchCreate, BranchUpdate> {
  constructor() {
    super('Branch');
  }

  getItems() {
    return super.getItemRecords('name');
  }
}
