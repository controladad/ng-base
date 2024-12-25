import {
  RoleType,
  StatusType,
  ItemRecord,
  DriverCertificateType,
  GenderType,
  VehicleType,
  VehicleOwnershipType,
  VehiclePlateType,
  BillStatus,
  BillAdminStatus,
  VehicleTechnicalApprovalType,
  ShipmentOrderType,
  ShipmentOrderNumberOfWeighingType,
  ShipmentOrderContractType,
  TrafficBillStatus,
  ReportTableType,
  ReportField,
  ReportTimeRange,
  RelationalOperator,
  LogicalOperator,
  DashboardBillStatus,
} from '../../core';
import { TableColumnType } from '../components';

export const StatusValues: ItemRecord<StatusType>[] = [
  { value: 'Active', label: 'فعال' },
  { value: 'Inactive', label: 'غیرفعال' },
];

export const ActiveValues: ItemRecord<boolean>[] = [
  { value: true, label: 'فعال' },
  { value: false, label: 'غیرفعال' },
];

export const BooleanValues: ItemRecord<boolean>[] = [
  { value: true, label: 'بله' },
  { value: false, label: 'خیر' },
];

export const GenderValues: ItemRecord<GenderType>[] = [
  { value: 'male', label: 'مرد' },
  { value: 'female', label: 'زن' },
];

export const RoleValues: ItemRecord<RoleType | null>[] = [
  { value: 'Admin', label: 'ادمین' },
  { value: 'Manager', label: 'مدیر' },
  { value: 'Operator', label: 'اپراتور' },
  { value: 'WarehouseKeeper', label: 'مخزن دار' },
  { value: 'Metallurgist', label: 'متالورژیست' },
  { value: 'Reporter', label: 'گزارش گیر' },
  { value: null, label: 'کارمند' },
];

export const RoleAllValues: typeof RoleValues = [{ value: 'SuperAdmin', label: 'سوپرادمین' }, ...RoleValues];

export const DriverCertificateValues: ItemRecord<DriverCertificateType>[] = [
  { value: 'Paye1', label: 'پایه 1' },
  { value: 'Paye2', label: 'پایه 2' },
  { value: 'PayeVije', label: 'پایه ویژه' },
];

export const ItemTypeValues: ItemRecord<boolean>[] = [
  { value: false, label: 'اصلی' },
  { value: true, label: 'متفرقه' },
];

export const VehicleTypeValues: ItemRecord<VehicleType, number>[] = [
  { value: 'vanet', label: 'وانت', alt: 0 },
  { value: 'kamionet', label: 'کامیون', alt: 1 },
  { value: 'kamionTakMehvar', label: 'کامیون تک محور', alt: 2 },
  { value: 'kamionDoMehvar', label: 'کامیون دو محور', alt: 3 },
  { value: 'keshandeTakMehvar', label: 'کشنده تک محور', alt: 4 },
  { value: 'keshandeDoMehvar', label: 'کشنده دو محور', alt: 5 },
  { value: 'compressiTakMehvar', label: 'کمپرسی تک محور', alt: 6 },
  { value: 'compressiDoMehvar', label: 'کمپرسی دو محور', alt: 7 },
  { value: 'trailerTakMehvar', label: 'تریلی تک محور', alt: 8 },
  { value: 'treilerDoMehvar', label: 'تریلی دو محور', alt: 9 },
];

export const VehicleOwnerShipValues: ItemRecord<VehicleOwnershipType>[] = [
  { value: 'Sherkat', label: 'شرکت' },
  { value: 'Karkonan', label: 'کارکنان' },
  { value: 'Estijari', label: 'استجاری' },
  { value: 'PetmanKar', label: 'پیمانکار' },
];

export const VehiclePlateValues: ItemRecord<VehiclePlateType>[] = [
  { value: 'Rasmi', label: 'رسمی' },
  { value: 'GheirRasmi', label: 'غیر رسمی' },
];

export const VehicleTechnicalApprovalValues: ItemRecord<VehicleTechnicalApprovalType>[] = [
  { value: true, label: 'تایید فنی' },
  { value: false, label: 'عدم تایید فنی' },
];

export const BillStatusValues: ItemRecord<BillStatus>[] = [
  { value: 'InitialWeighing', label: 'توزین اولیه', permission: 'GetInitialWeighingBill' },
  { value: 'SecondaryWeighing', label: 'توزین ثانویه', permission: 'GetInitialWeighingBill' },
  { value: 'Delivered', label: 'تحویل شده', permission: 'GetDeliveredBill' },
];

export const BillAdminStatusValues: ItemRecord<BillAdminStatus>[] = [
  { value: 'Pending', label: 'صادر شده', permission: 'GetIssuedBill' },
  { value: 'Submitted', label: 'نهایی شده', permission: 'GetFinalizedBill' },
  { value: 'Canceled', label: 'باطل شده', permission: 'GetVoidedBill' },
];

export const ShipmentOrderTypeValues: ItemRecord<ShipmentOrderType, number>[] = [
  { value: 'Input', label: 'ورودی', alt: 1 },
  { value: 'Output', label: 'خروجی', alt: 2 },
];
export const ShipmentOrderNumberOfWeighingTypeValues: ItemRecord<ShipmentOrderNumberOfWeighingType, number>[] = [
  { value: 'OnceWeighed', label: 'یکبار توزین', alt: 0 },
  { value: 'WeighedTwice', label: 'دوبار توزین', alt: 1 },
];
export const ShipmentOrderContractTypeValues: ItemRecord<ShipmentOrderContractType, number>[] = [
  { value: 'Tonnage', label: 'تناژی', alt: 0 },
  { value: 'Volume', label: 'حجمی', alt: 1 },
];

export const EntezamatCanWeighingValues: ItemRecord<boolean>[] = [
  { value: true, label: 'با توزین' },
  { value: false, label: 'بدون توزین' },
];

export const DispatchingTrafficStatusValues: ItemRecord<TrafficBillStatus>[] = [
  { value: 'Arrival', label: 'ورود' },
  { value: 'Exit', label: 'خروج' },
  { value: 'Canceled', label: 'باطل شده' },
];

export const ReportTableTypeValues: ItemRecord<ReportTableType>[] = [
  { value: 'Bill', label: 'قبوض اصلی' },
  { value: 'OtherItemBill', label: 'قبوض متفرقه' },
  { value: 'Traffic', label: 'تردد دیسپچینگ' },
];

export const ReportFieldValues: ItemRecord<ReportField, TableColumnType>[] = [
  { value: 'Id', label: 'آیدی', alt: 'number' },
  { value: 'AdminStatus', label: 'وضعیت قبض' },
  { value: 'AdminStatusSetterId', label: 'آیدی کاربر ثبت کننده وضعیت قبض', alt: 'number' },
  { value: 'ArrivalConfirmerId', label: 'آیدی کاربر ثبت کننده زمان رسیدن', alt: 'number' },
  { value: 'ArrivalDescription', label: 'توضیح زمان رسیدن' },
  { value: 'ArrivalTime', label: 'زمان رسیدن', alt: 'datetime' },
  { value: 'BasicExplanation', label: 'توضیح اولیه' },
  { value: 'BillId', label: 'آیدی قبض', alt: 'number' },
  { value: 'BillNumber', label: 'شماره قبض', alt: 'number' },
  { value: 'BillStatus', label: 'وضعیت بار' },
  { value: 'BranchID', label: 'آیدی شعبه', alt: 'number' },
  { value: 'CanceledDescription', label: 'توضیح لغو' },
  { value: 'CheckoutConfirmerId', label: 'آیدی کاربر تایید کننده خروج', alt: 'number' },
  { value: 'CheckoutDescription', label: 'توضیح خروج' },
  { value: 'CheckoutTime', label: 'زمان خروج', alt: 'datetime' },
  { value: 'CompanyName', label: 'نام شرکت' },
  { value: 'DateTimeOfInitialWeight', label: 'تاریخ و ساعت توزین اولیه', alt: 'datetime' },
  { value: 'DateTimeOfSecondaryWeight', label: 'تاریخ و ساعت توزین ثانویه', alt: 'datetime' },
  { value: 'DateTimeOfTertiaryWeight', label: 'تاریخ و ساعت توزین سوم', alt: 'datetime' },
  { value: 'DelayAmount', label: 'مقدار تاخیر', alt: 'minutes' },
  { value: 'DelayedLoad', label: 'مدت زمان تاخیر', alt: 'minutes' },
  { value: 'DeliveryDescription', label: 'توضیح تحویل' },
  { value: 'DeliveryTime', label: 'زمان تحویل', alt: 'datetime' },
  { value: 'DriverId', label: 'آیدی راننده', alt: 'number' },
  { value: 'DriverName', label: 'نام راننده' },
  { value: 'EntezamatID', label: 'آیدی انتظامات', alt: 'number' },
  { value: 'FinalExplanation', label: 'توضیح نهایی' },
  { value: 'InitialDescription', label: 'توضیح توزین اولیه' },
  { value: 'InitialWeight', label: 'توزین اولیه' },
  { value: 'ItemId', label: 'آیدی قلم کالا', alt: 'number' },
  { value: 'LoadDifference', label: 'تفاوت بار' },
  { value: 'PlateNumber', label: 'شماره پلاک', alt: 'plate' },
  { value: 'RecipientId', label: 'آیدی کاربر تائید کننده', alt: 'number' },
  { value: 'SecondaryDescription', label: 'توضیح توزین ثانویه' },
  { value: 'SecondaryWeight', label: 'توزین ثانویه' },
  { value: 'ShipmentOrderId', label: 'آیدی دستور حمل', alt: 'number' },
  { value: 'ShipmentOrderType', label: 'نوع دستور حمل' },
  { value: 'ShippingTime', label: 'مدت زمان تحویل', alt: 'minutes' },
  { value: 'SubmitDescription', label: 'توضیح تایید' },
  { value: 'TertiaryWeighing', label: 'توزین سوم' },
  { value: 'TrafficDuration', label: 'مدت زمان تردد', alt: 'minutes' },
  { value: 'TrafficNumber', label: 'شماره تردد' },
  { value: 'TrafficStatus', label: 'وضعیت تردد' },
  { value: 'TruckingCompanyId', label: 'آیدی شرکت باربری', alt: 'number' },
  { value: 'UserId', label: 'آیدی کاربر', alt: 'number' },
  { value: 'VehicleId', label: 'آیدی وسیله نقلیه', alt: 'number' },
  { value: 'VehicleType', label: 'نوع وسیله نقلیه' },
  { value: 'WeighingStationId', label: 'آیدی ایستگاه توزین', alt: 'number' },
];

export const ReportTimeRangeValues: ItemRecord<ReportTimeRange>[] = [
  { value: 'Day', label: '۲۴ ساعت' },
  { value: 'Week', label: '۱ هفته' },
  { value: 'Month', label: '۱ ماه' },
  { value: 'SixMonths', label: '۶ ماه' },
  { value: 'Year', label: '۱ سال' },
  { value: 'TwoYears', label: '۲ سال' },
];

export const RelationalOperatorValues: ItemRecord<RelationalOperator>[] = [
  { value: 'EqualTo', label: 'برابر است با' },
  { value: 'NotEqualTo', label: 'برابر نیست با' },
  { value: 'GreaterThan', label: 'بزرگتر از' },
  { value: 'GreaterThanOrEqualTo', label: 'بزرگتر یا مساوی با' },
  { value: 'LessThan', label: 'کمتر از' },
  { value: 'LessThanOrEqualTo', label: 'کمتر یا مساوی با' },
  { value: 'Contains', label: 'شامل' },
];

export const LogicalOperatorValues: ItemRecord<LogicalOperator>[] = [
  { value: 'And', label: 'و' },
  { value: 'Or', label: 'یا' },
];

export const DashboardBillStatusValues: ItemRecord<DashboardBillStatus>[] = [
  { value: 'SecondaryWeighingAndPending', label: 'صادر و توزین ثانویه شده', permission: 'GetIssuedBill' },
  { value: 'DeliveredAndSubmitted', label: 'تحویل و نهایی شده', permission: 'GetFinalizedBill' },
  { value: 'DeliveredAndPending', label: 'صادر و تحویل شده', permission: 'GetVoidedBill' },
];

export const PermitStatusValues: ItemRecord<boolean>[] = [
  { value: true, label: 'مجاز' },
  { value: false, label: 'غیر مجاز' },
];
