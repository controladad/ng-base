import { BranchEntity } from './branch.model';
import { StatusType } from './api.model';

export interface EntezamatEntity {
  id: number;
  name: string;
  entezamatTopic: string;
  weighingEntezamatTopic: string;
  branches: BranchEntity[];
  canWeighing: boolean;
  ip: string;
  status: StatusType;
}

export interface EntezamatCreate {
  entezamatName: string;
  branchList: number[];
  canWeighing: boolean;
  ip: string;
  status: StatusType;
}

export type EntezamatUpdate = EntezamatCreate;
