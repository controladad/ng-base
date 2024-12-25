const ACTION_TYPES = ['read', 'create', 'update', 'delete', 'print', 'export', 'output', 'other'] as const;

export type ActionTypes = (typeof ACTION_TYPES)[number];

export function getAllActions() {
  return ACTION_TYPES;
}

export function permissionNameToKey(name: string, action: ActionTypes) {
  switch (action) {
    case 'create':
      return `Add${name}`;
    case 'update':
      return `Update${name}`;
    case 'read':
      return `Get${name}`;
    case 'delete':
      return '';
    case 'print':
      return `PrintListOf${name}`;
    case 'export':
      return `ExportAll${name}`;
    case 'output':
      return `${name}Output`;
    case `other`:
      return `${name}`;
  }
}

export function permissionActionToLabel(action: ActionTypes) {
  switch (action) {
    case 'create':
      return 'افزودن';
    case 'update':
      return 'ویرایش';
    case 'read':
      return 'دیدن صفحه';
    case 'delete':
      return 'حذف';
    case 'print':
      return 'پرینت';
    case 'export':
      return 'خروجی اکسل';
    case 'output':
      return 'خروجی';
    case `other`:
      return '';
  }
}
