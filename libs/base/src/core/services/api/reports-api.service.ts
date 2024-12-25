import { Injectable } from '@angular/core';
import { BaseApi } from './_base-api';
import { ReportCreate, ReportEntity, ReportUpdate } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class ReportsApiService extends BaseApi<ReportEntity, ReportCreate, ReportUpdate> {
  constructor() {
    super('Reports/ForUser', {
      post: 'Reports',
    });
  }
}
