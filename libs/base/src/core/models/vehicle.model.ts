import { DriverEntity } from './driver.model';
import { TruckingCompanyEntity } from './trucking-company.model';
import { StatusType } from './api.model';
import { BranchEntity } from './branch.model';
import { ShipmentOrderContractType } from './shipment-order.model';

export type VehicleType =
  | 'vanet'
  | 'kamionet'
  | 'kamionTakMehvar'
  | 'kamionDoMehvar'
  | 'keshandeTakMehvar'
  | 'keshandeDoMehvar'
  | 'compressiTakMehvar'
  | 'compressiDoMehvar'
  | 'trailerTakMehvar'
  | 'treilerDoMehvar';
export type VehicleOwnershipType = 'Sherkat' | 'Karkonan' | 'Estijari' | 'PetmanKar';
export type VehiclePlateType = 'Rasmi' | 'GheirRasmi';
export type VehicleTechnicalApprovalType = boolean;

export interface VehicleEntity {
  id: number;
  branches: BranchEntity[];
  carRoomType: string;
  driver: DriverEntity;
  expirationDate: string;
  maximumWeightAllowed: number;
  ownershipStatus: VehicleOwnershipType;
  plateNumber: string;
  plateType: VehiclePlateType;
  rfidCode: string;
  status: StatusType;
  technicalApproval: VehicleTechnicalApprovalType;
  truckingCompany: TruckingCompanyEntity;
  vehicleCapacity: number;
  vehicleName: string;
  vehicleType: VehicleType;
  vehicleWeigh: number;
  vehicleCode?: string;
  gpsSerial?: string;
  shipmentOrderId?: number;
}

export interface VehicleCreate {
  vehicleName: string;
  vehicleType: VehicleType;
  vehicleWeigh: number;
  vehicleCapacity: number;
  plateNumber: string;
  maximumWeightAllowed: number;
  technicalApproval: boolean;
  ownershipStatus: VehicleOwnershipType;
  plateType: VehiclePlateType;
  rfidCode: string;
  expirationDate: string;
  carRoomType: string;
  driverId: number;
  truckingCompanyId: number;
  status: StatusType;
  branchList: number[];
  vehicleCode?: string;
  gpsSerial?: string;
  shipmentOrderId?: number;
}

export type VehicleUpdate = Partial<VehicleCreate>;

export interface VehicleDetails {
  branches: BranchEntity[];
  contractType: ShipmentOrderContractType;
  driverName: string;
  driverPhoneNumber: string;
  plateNumber: string;
  shipmentOrderNumber: string;
  truckingCompanyName: string;
  vehicleCode: string;
}
