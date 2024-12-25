export interface BarChartData {
  data: {
    label: string;
    data: number[];
  }[];
  labels: string[];
}

export interface DoughnutChartData {
  data: { label: string; value: number }[];
}

export interface DashboardChart {
  title: string;
  description?: string;
  barChart?: BarChartData;
  doughnutChart?: DoughnutChartData;
  hidden?: boolean;
}

export interface DashboardFilter {
  startTime: Date;
  endTime: Date;
  branchIds: number[];
}

export interface BillsDashboard {
  entezamatDeliveryCount: EntezamatDelivery[];
  entezamatDeliveryKG: EntezamatDelivery[];
  weighbridgeDeliveryCount: WeighbridgeDelivery[];
  weighbridgeDeliveryKG: WeighbridgeDelivery[];
  countLoadsCarriedByDriver: CountLoadsCarriedByDriver[];
  itemCarried: ItemCarried[];
  tonnageLoadCarriedWithShipmentOrder: TonnageLoadCarriedWithShipmentOrder[];
  countLoadCarriedWithDelay: CountLoadCarriedWithDelay[];
  countLoadCarriedWithCompany: CountLoadCarriedWithCompany[];
  tonnageLoadsCarriedByDriver: TonnageLoadsCarriedByDriver[];
  billsWithStatus: BillsWithStatus[];
}

export interface OtherItemBillsDashboard {
  weighbridgeDeliveryCount: WeighbridgeDelivery[];
  weighbridgeDeliveryKG: WeighbridgeDelivery[];
  countLoadsCarriedByDriver: CountLoadsCarriedByDriver[];
  tonnageLoadsCarriedByDriver: TonnageLoadsCarriedByDriver[];
  countLoadsCarriedOfItemWithCompany: CountLoadsCarriedOfItemWithCompany[];
  countLoadsCarriedOfItemWithBranch: CountLoadsCarriedOfItemWithBranch[];
  countLoadCarriedWithCompany: CountLoadCarriedWithCompany[];
}

export interface TrafficDashboard {
  trafficOfAnyContractType: TrafficOfAnyContractType[];
  registerOfTrafficByUser: RegisterOfTrafficByUser[];
  trafficInBranchByCompany: TrafficInBranchByCompany[];
}

interface BillsWithStatus {
  status: DashboardBillStatus;
  count: number;
}

export type DashboardBillStatus = 'SecondaryWeighingAndPending' | 'DeliveredAndPending' | 'DeliveredAndSubmitted';

interface CountLoadCarriedWithCompany {
  branchName: string;
  companys: Company[];
  totalLoadsCarried: number;
}

interface Company {
  companyName: string;
  tonnageLoadCarried: number;
}

interface CountLoadCarriedWithDelay {
  companyName: string;
  delay: Delay[];
  totalLoadsCarried: number;
}

interface Delay {
  isDelayed: boolean;
  countLoadCarried: number;
}

interface CountLoadsCarriedByDriver {
  companyName: string;
  drivers: Driver[];
  totalLoadsCarried: number;
}

interface Driver {
  driverName: string;
  loadsCarried: number;
}

interface EntezamatDelivery {
  entezamatName: null | string;
  userDeliveryList: UserDeliveryList[];
  totalDelivery: number;
}

interface UserDeliveryList {
  userName: string;
  delivery: number;
}

interface ItemCarried {
  itrmName: string;
  itemCarried: number;
}

interface TonnageLoadCarriedWithShipmentOrder {
  companyName: string;
  shipmentOrders: ShipmentOrder[];
  totalLoadsCarried: number;
}

interface ShipmentOrder {
  shipmentOrderName: string;
  tonnageLoadCarried: number;
}

interface TonnageLoadsCarriedByDriver {
  companyName: string;
  drivers: Driver[];
  tonnageLoadCarried: number;
}

interface WeighbridgeDelivery {
  weighingStationName: string;
  userList: UserList[];
  totalWeighing: number;
}

interface UserList {
  userName: string;
  weighing: number;
}

interface CountLoadsCarriedOfItemWithCompany {
  itemName: string;
  companys: Company[];
  totalLoadCarried: number;
}

interface CountLoadsCarriedOfItemWithBranch {
  itemName: string;
  branchs: Branch[];
  totalLoadCarried: number;
}

interface Branch {
  branchName: string;
  tonnageLoadCarried: number;
}

interface TrafficOfAnyContractType {
  contractType: string;
  count: number;
}

interface RegisterOfTrafficByUser {
  userName: string;
  typeOfTraffic: TypeOfTraffic[];
  totalCount: number;
}

interface TypeOfTraffic {
  shipmentOrderType: string;
  count: number;
}

interface TrafficInBranchByCompany {
  branchName: string;
  companys: TrafficICompany[];
  totalCount: number;
}

interface TrafficICompany {
  companyName: string;
  count: number;
}
