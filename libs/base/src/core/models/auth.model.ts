import { UserEntity } from './user.model';

export interface AuthEntity {
  jwt: string;
  user: UserEntity;
}

export interface LoginModel {
  nationalCode: string;
  password: string;
  ip?: string;
}
