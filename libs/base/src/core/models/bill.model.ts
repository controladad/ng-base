import { ShipmentOrderEntity } from './shipment-order.model';
import { VehicleEntity } from './vehicle.model';
import { WeighingStationEntity } from './weighing-station.model';
import { APIPaginatedData } from './api.model';
import { UserEntity } from './user.model';
import { BranchEntity } from './branch.model';
import { EntezamatEntity } from './entezamat.model';

export type BillStatus = 'InitialWeighing' | 'SecondaryWeighing' | 'Delivered';

export type BillAdminStatus = 'Canceled' | 'Pending' | 'Submitted';

export interface BillEntity {
  id: string;
  dateTimeOfInitialWeight: string;
  dateTimeOfSecondaryWeight: string | null;
  vehicle: VehicleEntity;
  vehicleId: number;
  initialWeight: number;
  secondaryWeight: number | null;
  shipmentOrder: ShipmentOrderEntity;
  weighingStation: WeighingStationEntity | null;
  shouldWeighAtDestination: boolean;
  deliveryWeight: number;
  netDeliveryWeight: number;
  billNumber: string;
  deliveryTime: string | null;
  user: UserEntity | null;
  userId: number;
  billStatus: BillStatus;
  adminStatus: BillAdminStatus | null;
  arrivalTime: string | null;
  recipient: UserEntity | null;
  recipientId: string | null;
  adminStatusSetter: UserEntity | null;
  delayAmount: number | null;
  delayedLoad: boolean;
  shippingTime: number | null;
  branch: BranchEntity;
  entezamat?: EntezamatEntity;
  initialDescription: string | null;
  secondaryDescription: string | null;
  canceledDescription: string | null;
  deliveryDescription: string | null;
  submitDescription: string | null;
}

export interface BillPaginatedData extends APIPaginatedData<BillEntity> {
  totalCountOfVehicles: number;
  totalWeightOfInputs: number;
  totalWeightOfOutputs: number;
}

export interface BillCreate {
  billId: string;
  billNumber: string;
  vehicleId: number;
  initialWeight: number;
  dateTimeOfInitialWeight: string;
  shipmentOrderId: number;
  weighingStationId: number;
  initialDescription?: string;
}

export interface BillUpdate {
  billId: string;
  secondaryWeight: number;
  dateTimeOfSecondaryWeight: string;
  userId: number;
  weighingStationId: number;
  entezamatID: number;
  secondaryDescription?: string;
}

export interface BillUpdateStatus {
  id: string;
  adminStatus: BillAdminStatus;
  explanation: string;
}

export interface BillSetArrivalTime {
  id: string;
  arrivalTime: string;
  entezamatID: number;
}

export interface BillSetDeliveryTime {
  id: string;
  deliveryTime: string;
  entezamatID: number;
}

export interface BillSetDeliveryConfirmation {
  id: string;
  deliveryTime: string;
  entezamatID: number | null;
  deliveryDescription: string | null;
}
