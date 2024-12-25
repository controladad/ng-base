import { Injectable } from '@angular/core';
import { BaseApi } from './_base-api';
import { ExitTrafficRegistration, TrafficBillCreate, TrafficBillEntity, TrafficBillStatusUpdate } from '../../models';
import { DataGetRequest } from '../../interfaces';

@Injectable({
  providedIn: 'root',
})
export class TrafficBillApiService extends BaseApi<TrafficBillEntity, TrafficBillStatusUpdate> {
  constructor() {
    super('TrafficsReports');
  }

  getItems() {
    return super.getItemRecords('id');
  }

  // @ts-ignore
  override create(model: TrafficBillCreate) {
    return http$.post('/TrafficRegistration', model);
  }

  exit(model: ExitTrafficRegistration) {
    return http$.post('/ExitTrafficRegistration', model);
  }

  approveTraffic(model: TrafficBillStatusUpdate) {
    return http$.post<any>('/VerifyArrivalTraffic', model);
  }

  declineTraffic(model: TrafficBillStatusUpdate) {
    return http$.put<any>('/CancellationOfTraffic', model);
  }

  export(query?: DataGetRequest) {
    return super.exportAndDownload('/traffic_reports_excel_export', query);
  }

  getRecent(count: number) {
    return this.getAll({
      pagination: {
        page: 1,
        size: count,
      },
      sort: {
        key: 'ArrivalTime',
        direction: 'desc',
      },
    });
  }
}
