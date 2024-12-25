import { StatusType } from './api.model';

export interface ItemEntity {
  id: number;
  itemName: string;
  itemCode: string;
  other: boolean;
  status: StatusType;
}

export interface ItemCreate {
  itemName: string;
  itemCode: string;
  other: boolean;
  status: StatusType;
}

export type ItemUpdate = Partial<ItemCreate>;
