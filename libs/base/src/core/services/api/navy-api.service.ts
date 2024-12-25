import { Injectable } from '@angular/core';
import { BaseApi } from './_base-api';

@Injectable({
  providedIn: 'root',
})
export class NavyApiService extends BaseApi<any> {
  constructor() {
    super('Traccar');
  }

  getDispatchingTrafficRoute(id: number | string) {
    return http$.get(`/Traccar/RouteBetweenEntryAndExit/${id}`);
  }

  getBillRoute(id: number | string) {
    return http$.get(`/Traccar/RouteBetweenSecondaryWeighingAndDelivery/${id}`);
  }
}
