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
      return $localize`:@@base.permissions.crudActions.create:Add`;
    case 'update':
      return $localize`:@@base.permissions.crudActions.update:Edit`;
    case 'read':
      return $localize`:@@base.permissions.crudActions.read:View Only`;
    case 'delete':
      return $localize`:@@base.permissions.crudActions.delete:Delete`;
    case 'print':
      return $localize`:@@base.permissions.crudActions.print:Print`;
    case 'export':
      return $localize`:@@base.permissions.crudActions.export:Export excel`;
    case 'output':
      return $localize`:@@base.permissions.crudActions.output:Export`;
    case `other`:
      return '';
  }
}
