import { Injectable } from '@angular/core';
import { BaseApi } from './_base-api';
import { VehicleCreate, VehicleDetails, VehicleEntity, VehicleUpdate } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class VehicleApiService extends BaseApi<VehicleEntity, VehicleCreate, VehicleUpdate> {
  constructor() {
    super('Vehicle');
  }

  getItems() {
    return this.getItemRecords((v) => {
      const plate = v.plateNumber;
      const first = plate.substring(0, 2);
      const letter = plate.substring(2, 3);
      const second = plate.substring(3, 5);
      const region = plate.substring(5, 7);
      return {
        label: `${first} ${letter} ${second} ${region}`,
        value: v.id,
        additionalData: `${v.vehicleCode} ${v.plateNumber}`,
        alt: `${plate.substring(3, 6)} ${letter} ${first} ایران ${plate.substring(6, 8)} / کد: ${v.id}` as string,
      };
    });
  }

  getDetails(id: number) {
    return this.http.get<{ vehicleDetailsDto: VehicleDetails }>(`/Vehicle/Details/${id}`);
  }
}
