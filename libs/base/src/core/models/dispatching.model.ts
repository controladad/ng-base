import { APIPaginatedData, StatusType } from './api.model';
import { BranchEntity } from './branch.model';
import { ShipmentOrderContractType } from './shipment-order.model';
import { VehicleType } from './vehicle.model';

export type TrafficBillStatus = 'Arrival' | 'Canceled' | 'Exit';

export interface DispatchingStationEntity {
  id: number;
  name: string;
  branch: BranchEntity;
  ip: string;
  status: StatusType;
  dispatchingStationTopic: string;
}

export interface DispatchingStationCreate {
  name: string;
  branchId: number;
  ip: string;
  status: StatusType;
}

export type DispatchingStationUpdate = Partial<DispatchingStationCreate>;

export interface TrafficBillEntity {
  id: number;
  arrivalTime: string;
  checkoutTime: string;
  trafficNumber: string;
  arrivalConfirmerName: string;
  checkoutConfirmerName: string;
  vehiclePlateNumber: string;
  vehicleCode: string;
  vehicleType?: VehicleType;
  driverName: string;
  truckingCompanyName: string;
  shipmentOrderNumber: string;
  shipmentOrderTitle: string;
  itemName: string;
  contractType: ShipmentOrderContractType;
  branchName: string;
  trafficDurationSec?: number;
  trafficStatus: TrafficBillStatus;
  arrivalDescription?: string;
  canceledDescription?: string;
  checkoutDescription?: string;
}

export interface TrafficBillStatusUpdate {
  id: number;
  reason: string;
}

export interface TrafficBillPaginatedData extends APIPaginatedData<TrafficBillEntity> {
  totalCountOfTraffics: number;
  totalCountOfVehicles: number;
}

export interface TrafficBillCreate {
  id: string;
  trafficNumber: string;
  vehicleId: number;
  driverId: number;
  truckingCompanyId: number;
  shipmentOrderId: number;
  branchId: number;
  arrivalDescription: string;
}

export interface ExitTrafficRegistration {
  trafficNumber: string;
  checkoutDescription: string;
}
