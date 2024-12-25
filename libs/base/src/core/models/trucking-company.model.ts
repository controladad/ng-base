import { StatusType } from './api.model';
import { BranchEntity } from './branch.model';

export interface TruckingCompanyEntity {
  id: number;
  truckingCompanyName: string;
  truckingCompanyCode: string;
  agentFirstName: string;
  agentLastName: string;
  agentMobileNumber: string;
  status: StatusType;
  branches: BranchEntity[];
}

export interface TruckingCompanyCreate {
  truckingCompanyName: string;
  truckingCompanyCode: string;
  agentFirstName: string;
  agentLastName: string;
  agentMobileNumber: string;
  status: StatusType;
  branchList: number[];
}

export type TruckingCompanyUpdate = Partial<TruckingCompanyCreate>;
