export type RoleType =
  | 'SuperAdmin'
  | 'Admin'
  | 'Operator'
  | 'Metallurgist'
  | 'WarehouseKeeper'
  | 'Reporter'
  | 'Manager';

export interface DynamicRoleEntity {
  id: number;
  name: string;
  permissions: string[];
}

export interface DynamicRoleCreate {
  name: string;
  permissions: string[];
}

export type DynamicRoleUpdate = Partial<DynamicRoleCreate>;
