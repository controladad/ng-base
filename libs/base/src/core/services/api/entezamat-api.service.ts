import { Injectable } from '@angular/core';
import { BaseApi } from './_base-api';
import { EntezamatCreate, EntezamatEntity, EntezamatUpdate } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class EntezamatApiService extends BaseApi<EntezamatEntity, EntezamatCreate, EntezamatUpdate> {
  constructor() {
    super('Entezamat');
  }

  getItems(branchIds?: number | number[]) {
    return super.getItemRecords('name', true, [{ key: 'BranchIds', value: branchIds }]);
  }

  getAllByBranch(branchIds?: number | number[]) {
    return super.getAll({
      filters: [{ key: 'BranchIds', value: branchIds }],
    });
  }
}
