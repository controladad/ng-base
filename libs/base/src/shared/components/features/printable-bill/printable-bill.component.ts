import { Component, Input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { LicensePlateComponent } from '../../ui';
import {
  BillEntity,
  getFromItemRecord,
  getFullName,
  getJalaliDate,
  getPureWeight,
  OtherBillEntity,
} from '../../../../core';
import { VehicleTypeValues } from '../../../data';

export interface PrintableBillData {
  date: string;
  billNumber: string;
  dateOfInitialWeight: string;
  dateOfSecondaryWeight: string;
  timeOfInitialWeight: string;
  timeOfSecondaryWeight: string;
  customer?: string;
  user: string;
  itemName?: string;
  vehicle?: string;
  vehicleCode?: string;
  plateNumber?: string;
  initialWeight: number;
  secondaryWeight: number;
  pureWeight: number;
  driver?: string;
  branch?: string;
  shipmentOrder?: string;
}

@Component({
  selector: 'feature-printable-bill',
  standalone: true,
  imports: [NgIf, MatButtonModule, LicensePlateComponent],
  templateUrl: './printable-bill.component.html',
  styleUrls: ['./printable-bill.component.scss'],
})
export class PrintableBillComponent implements OnChanges {
  @Input() bill?: BillEntity | OtherBillEntity;
  @Input() data?: PrintableBillData;

  billData = signal<PrintableBillData | undefined>(undefined);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['bill'] || changes['data']) {
      this.populateBillData();
    }
  }

  private populateBillData() {
    if (this.data) {
      this.billData.set(this.data);
      return;
    }
    if (!this.bill) return;

    const bill = this.bill;

    let billData: PrintableBillData = {
      date: getJalaliDate(new Date()),
      billNumber: bill.billNumber,
      dateOfInitialWeight: getJalaliDate(bill.dateTimeOfInitialWeight),
      timeOfInitialWeight: getJalaliDate(bill.dateTimeOfInitialWeight, 'HH:mm'),
      dateOfSecondaryWeight: bill.dateTimeOfSecondaryWeight ? getJalaliDate(bill.dateTimeOfSecondaryWeight) : '-',
      timeOfSecondaryWeight: bill.dateTimeOfSecondaryWeight
        ? getJalaliDate(bill.dateTimeOfSecondaryWeight, 'HH:mm')
        : '-',
      user: getFullName(bill.user),
      initialWeight: bill.initialWeight,
      secondaryWeight: bill.secondaryWeight ?? 0,
      pureWeight: getPureWeight(bill) ?? 0,
      branch: bill.branch.name,
    };
    if ('shipmentOrder' in bill) {
      billData = {
        ...billData,
        customer: bill.shipmentOrder.truckingCompany?.truckingCompanyName || '',
        itemName: bill.shipmentOrder.item.itemName,
        vehicle: getFromItemRecord(VehicleTypeValues, bill.vehicle.vehicleType)?.label || '-',
        vehicleCode: bill.vehicle.vehicleCode ?? '-',
        plateNumber: bill.vehicle.plateNumber,
        driver: getFullName(bill.vehicle.driver),
        shipmentOrder: bill.shipmentOrder.shipmentOrderNumber,
      };
    } else {
      billData = {
        ...billData,
        customer: bill.companyName,
        itemName: bill.item.itemName,
        vehicle: getFromItemRecord(VehicleTypeValues, bill.vehicleType)?.label || '-',
        vehicleCode: '-',
        plateNumber: bill.plateNumber,
        driver: bill.driverName,
        shipmentOrder: '-',
      };
    }

    this.billData.set(billData);
  }
}
