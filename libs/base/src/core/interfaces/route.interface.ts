import type { Route } from '@angular/router';
import type { BASE_ICONS } from '../../configs';

export interface RoutePermission {
  name: string;
  keys: string[];
}

export type RouteExtended = Omit<Route, 'children'> & {
  children?: RouteExtended[];
  layout?: 'main';
  view?: { label?: string; icon?: BASE_ICONS | { default: string; active: string } };
  // when use string, it will be considered as the permission name
  permissions?: string | { name?: string; key: string | string[] };
  // Guest = Non-Authenticated Users
  visibleToGuest?: boolean;
  permittedRoles?: string[];
};

export type RoutesExtended = RouteExtended[];

export interface RouteItem {
  path: string;
  level: number;
  label?: string;
  icon?: { active?: string; default: string };
  parent?: RouteItem;
  children?: RouteItem[];
  permission?: RoutePermission;
  visibleToGuest?: boolean;
  isPlaceholder?: boolean;
  permittedRoles?: string[],
  hidden?: boolean;
}
