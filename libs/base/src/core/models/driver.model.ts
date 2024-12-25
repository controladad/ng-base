import { GenderType, StatusType } from './api.model';

export type DriverCertificateType = 'Paye1' | 'Paye2' | 'PayeVije';

export interface DriverEntity {
  id: number;
  firstName: string;
  lastName: string;
  nationalCode: string;
  phoneNumber: string;
  mobileNumber: string;
  address: string;
  licenseNumber: string;
  gender: GenderType;
  certificateType: DriverCertificateType;
  status: StatusType;
}

export interface DriverCreate {
  firstName: string;
  lastName: string;
  nationalCode: string;
  phoneNumber: string;
  mobileNumber: string;
  address: string;
  licenseNumber: string;
  certificateType: DriverCertificateType;
  status?: StatusType;
  gender: GenderType;
}

export type DriverUpdate = Partial<DriverCreate>;
