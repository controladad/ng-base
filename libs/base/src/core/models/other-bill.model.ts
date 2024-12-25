import { ShipmentOrderType } from './shipment-order.model';
import { VehicleType } from './vehicle.model';
import { WeighingStationEntity } from './weighing-station.model';
import { ItemEntity } from './item.model';
import { UserEntity } from './user.model';
import { BranchEntity } from './branch.model';
import { APIPaginatedData } from './api.model';

export interface OtherBillEntity {
  id: string;
  billNumber: string;
  initialWeight: number;
  dateTimeOfInitialWeight: string;
  weighingStationId: number;
  itemId: number;
  driverName: string;
  companyName: string;
  plateNumber: string;
  vehicleType: VehicleType;
  shipmentOrderType: ShipmentOrderType;
  secondaryWeight: null;
  dateTimeOfSecondaryWeight: null;
  userId: number | null;
  user: UserEntity | null;
  stationId: number;
  station: WeighingStationEntity;
  item: ItemEntity;
  branch: BranchEntity;
  basicExplanation?: string | null;
  finalExplanation?: string | null;
}

export interface OtherBillPaginatedData extends APIPaginatedData<OtherBillEntity> {
  totalCountOfVehicles: number;
  totalWeightOfInputs: number;
  totalWeightOfOutputs: number;
}

export interface OtherBillCreate {
  billId: string;
  billNumber: string;
  initialWeight: number;
  dateTimeOfInitialWeight: string;
  weighingStationId: number;
  itemId: number;
  driverName: string;
  companyName: string;
  plateNumber: string;
  vehicleType: VehicleType;
  shipmentOrderType: ShipmentOrderType;
  branchID: number;
  basicExplanation?: string;
}

export interface OtherBillUpdate {
  billId: string;
  secondaryWeight: number;
  weighingStationId: number;
  dateTimeOfSecondaryWeight: string;
  userId: number;
  finalExplanation?: string;
}

export interface OtherBillSetSecondaryWeight {
  billId: string;
  secondaryWeight: number;
  dateTimeOfSecondaryWeight: string;
  userId: number;
}
