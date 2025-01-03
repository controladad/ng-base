import type { Route } from '@angular/router';

export interface RoutePermission {
  name: string;
  keys: string[];
}

export type RouteExtended = Omit<Route, 'children'> & {
  children?: RouteExtended[];
  layout?: 'main';
  view?: { label?: string; icon?: string | { default: string; active: string } };
  // when use string, it will be considered as the permission name
  permissions?: string | { name?: string; key: string | string[] };
  // Guest = Non-Authenticated Users
  visibleToGuest?: boolean;
};

export type RoutesExtended = RouteExtended[];

export interface RouteItem {
  path: string;
  label?: string;
  icon?: { active?: string; default: string };
  children?: RouteItem[];
  permission?: RoutePermission;
  visibleToGuest?: boolean;
}
