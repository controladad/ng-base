import { ItemEntity } from './item.model';
import { TruckingCompanyEntity } from './trucking-company.model';
import { StatusType } from './api.model';
import { BranchEntity } from './branch.model';
import { EntezamatEntity } from './entezamat.model';

export type ShipmentOrderType = 'Input' | 'Output';
export type ShipmentOrderNumberOfWeighingType = 'OnceWeighed' | 'WeighedTwice';
export type ShipmentOrderContractType = 'Tonnage' | 'Volume';

export interface ShipmentOrderEntity {
  id: number;
  shipmentOrderTitle: string;
  shipmentOrderNumber: string;
  shipmentOrderType: ShipmentOrderType;
  numberOfWeighing: ShipmentOrderNumberOfWeighingType;
  contractNumber: string;
  contractType: ShipmentOrderContractType;
  itemId: number;
  status: StatusType;
  needsEntezamatConfirmation: boolean;
  initialWeighingValidityPeriod: number;
  branch: BranchEntity;
  branchID: number;
  maximumShipmentTime?: number;
  truckingCompanyId: number;
  truckingCompany: TruckingCompanyEntity;
  item: ItemEntity;
  defaultEntezamat?: EntezamatEntity;
  entezamats?: EntezamatEntity[];
  expirationDate?: string;
  carriedSumPermissibleLoad: number;
  excessOfCarriedSumPermissibleLoad: number;
  neetToWeighingAtDestination?: boolean;
  permissibleRangeOfWeightDifference: number;
  totalWeigth: number;
}

export interface ShipmentOrderCreate {
  shipmentOrderTitle: string;
  shipmentOrderNumber: string;
  shipmentOrderType?: ShipmentOrderType;
  numberOfWeighing?: ShipmentOrderNumberOfWeighingType;
  contractNumber: string;
  contractType: ShipmentOrderContractType;
  itemId: number;
  status: StatusType;
  needsEntezamatConfirmation?: boolean;
  initialWeighingValidityPeriod?: number;
  branchID: number;
  entezamatIDs?: number[];
  defaultEntezamatID?: number;
  maximumShipmentTime?: number;
  truckingCompanyId: number;
  expirationDate: string;
  carriedSumPermissibleLoad?: number | null;
  excessOfCarriedSumPermissibleLoad?: number | null;
  neetToWeighingAtDestination?: boolean;
  permissibleRangeOfWeightDifference?: number | null;
}

export interface ShipmentOrderWithTotalweight {
  shipmentOrders: ShipmentOrderWithTotalweightItem[];
}

export interface ShipmentOrderWithTotalweightItem {
  shipmentOrder: ShipmentOrderEntity;
  totalInitialWeight: number;
  totalSecondaryWeight: number;
  totalWeigth: number;
}

export type ShipmentOrderUpdate = Partial<ShipmentOrderCreate>;
