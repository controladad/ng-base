import { BillEntity } from '../models';
import * as dateFns from 'date-fns';
import { getDatesIntervalInHHMMSS } from './date.helper';

export function getPureWeight(bill: { initialWeight?: number | null; secondaryWeight?: number | null } | undefined) {
  return bill?.secondaryWeight ? Math.abs((bill.initialWeight ?? 0) - (bill.secondaryWeight ?? 0)) : undefined;
}

export function getPureWeightWithUnit(
  bill: { initialWeight?: number | null; secondaryWeight?: number | null } | undefined,
) {
  const pureWeight = getPureWeight(bill);
  return pureWeight !== undefined ? `${pureWeight} کیلوگرم` : '';
}

export function getBillDelay(bill: BillEntity) {
  const start = new Date(bill.dateTimeOfSecondaryWeight!);
  const end = bill.arrivalTime ? new Date(bill.arrivalTime) : new Date();
  start.setMilliseconds(0);
  end.setMilliseconds(0);
  const due = dateFns.addMinutes(start, bill.shipmentOrder.maximumShipmentTime ?? 0);
  return getDatesIntervalInHHMMSS(end, due, true);
}
