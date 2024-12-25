import { StatusType } from './api.model';
import { BranchEntity } from './branch.model';

export interface WeighingStationEntity {
  id: number;
  stationName: string;
  ip: string;
  branch: BranchEntity;
  status: StatusType;
}

export interface WeighingStationCreate {
  stationName: string;
  ip: string;
  status: StatusType;
  branchID: number;
}

export type WeighingStationUpdate = Partial<WeighingStationCreate>;
