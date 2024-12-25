import { Injectable } from '@angular/core';
import { BaseApi } from './_base-api';
import { BillsDashboard, DashboardFilter, OtherItemBillsDashboard, TrafficDashboard } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class DashboardApiService extends BaseApi<any, any, any> {
  constructor() {
    super('');
  }

  getBillsDashboard(model: DashboardFilter) {
    return http$.get<BillsDashboard>(`/Dashboard/Bills?${this.getDashboardQuery(model)}`);
  }

  getOtherItemBillsDashboard(model: DashboardFilter) {
    return http$.get<OtherItemBillsDashboard>(`/Dashboard/OtherItemBills?${this.getDashboardQuery(model)}`);
  }

  getTrafficDashboard(model: DashboardFilter) {
    return http$.get<TrafficDashboard>(`/Dashboard/Traffics?${this.getDashboardQuery(model)}`);
  }

  private getDashboardQuery(model: DashboardFilter) {
    return `StartTime=${model.startTime.toISOString()}&EndTime=${model.endTime.toISOString()}${model?.branchIds ? '&' + model.branchIds.map((x) => `BranchIds=${x}`).join('&') : ''}`;
  }
}
