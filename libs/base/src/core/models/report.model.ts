export interface ReportEntity {
  id: number;
  reportName: string;
}

export interface ReportCreate {
  reportName: string;
  userIds: number[];
  tableType: ReportTableType;
  orderBy: ReportField;
  groupBy: ReportField;
  timeRange: ReportTimeRange;
  statement: ReportStatement;
}

export interface ReportStatement {
  condition: StatementCondition | null;
  combinedConditions: StatementCombinedConditions | null;
}

export interface StatementCondition {
  operation: RelationalOperator;
  fieldName: ReportField;
  value: string;
}

export interface StatementCombinedConditions {
  operation: LogicalOperator;
  statements: ReportStatement[];
}

export type ReportUpdate = Partial<ReportCreate>;

export type ReportTableType = 'Bill' | 'OtherItemBill' | 'Traffic';
export type ReportField =
  | 'Id'
  | 'VehicleId'
  | 'InitialWeight'
  | 'DateTimeOfInitialWeight'
  | 'SecondaryWeight'
  | 'DateTimeOfSecondaryWeight'
  | 'ShipmentOrderId'
  | 'WeighingStationId'
  | 'BillNumber'
  | 'DeliveryTime'
  | 'ArrivalTime'
  | 'UserId'
  | 'RecipientId'
  | 'BillStatus'
  | 'AdminStatus'
  | 'AdminStatusSetterId'
  | 'DelayedLoad'
  | 'DelayAmount'
  | 'ShippingTime'
  | 'BranchID'
  | 'EntezamatID'
  | 'InitialDescription'
  | 'SecondaryDescription'
  | 'CanceledDescription'
  | 'DeliveryDescription'
  | 'SubmitDescription'
  | 'TertiaryWeighing'
  | 'DateTimeOfTertiaryWeight'
  | 'LoadDifference'
  | 'PlateNumber'
  | 'DriverName'
  | 'VehicleType'
  | 'CompanyName'
  | 'ItemId'
  | 'ShipmentOrderType'
  | 'BasicExplanation'
  | 'FinalExplanation'
  | 'CheckoutTime'
  | 'TrafficNumber'
  | 'ArrivalConfirmerId'
  | 'CheckoutConfirmerId'
  | 'DriverId'
  | 'TruckingCompanyId'
  | 'TrafficDuration'
  | 'BillId'
  | 'TrafficStatus'
  | 'ArrivalDescription'
  | 'CheckoutDescription';
export type ReportTimeRange = 'Day' | 'Week' | 'Month' | 'SixMonths' | 'Year' | 'TwoYears';
export type RelationalOperator =
  | 'EqualTo'
  | 'NotEqualTo'
  | 'GreaterThan'
  | 'LessThan'
  | 'GreaterThanOrEqualTo'
  | 'LessThanOrEqualTo'
  | 'Contains';
export type LogicalOperator = 'And' | 'Or';
