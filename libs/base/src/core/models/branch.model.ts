import { StatusType } from './api.model';

export interface BranchEntity {
  id: number;
  name: string;
  description: string;
  billRegistrationWithMachineCodeEnabled: boolean;
  timeLimit: number;
  resetInitialWeightsEnabled: boolean;
  dispatchingStatus: StatusType | null;
}

export interface BranchCreate {
  name: string;
  description: string;
}

export type BranchUpdate = Partial<BranchCreate> & {
  timeLimit?: number;
  resetEnable?: boolean;
  billRegistrationEnabled?: boolean;
};
