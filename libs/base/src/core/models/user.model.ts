import { DynamicRoleEntity } from './role.model';
import { StatusType } from './api.model';

export interface UserEntity {
  id: number;
  nationalCode: string;
  personnelID: string;
  firstName: string;
  lastName: string;
  status: StatusType;
  roles: DynamicRoleEntity[];
  permissions: string[];
  profileImagePath: string;
}

export interface UserCreate {
  nationalCode: string;
  firstName: string;
  lastName: string;
  personnelID: string;
  password: string;
  roleIds: number[];
  status: StatusType;
  branchList: number[];
  imagePath?: string | null;
  phoneNumber?: string;
}

export type UserUpdate = Partial<UserCreate>;

export interface ChangePassword {
  oldPassword: string;
  newPassword: string;
}
