import { ItemRecord } from '../../core';

export const ActiveValues: ItemRecord<boolean>[] = [
  { value: true, label: 'Active' },
  { value: false, label: 'Inactive' },
];

export const SuspendedValues: ItemRecord<boolean>[] = [
  { value: false, label: 'Active' },
  { value: true, label: 'Inactive' },
];

export const BooleanValues: ItemRecord<boolean>[] = [
  { value: true, label: 'Yes' },
  { value: false, label: 'No' },
];
