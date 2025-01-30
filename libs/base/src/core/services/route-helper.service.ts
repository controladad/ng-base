import { computed, inject, Injectable, signal } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, ResolveStart, Router, Routes } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouteExtended, RouteItem, RoutePermission, RoutesExtended } from '../interfaces';
import { Location } from '@angular/common';
import { arraySafeAt, includes, isRouteExtended, resolveRouteChildren } from '../helpers';
import { RoleApiService } from './api';
import { CacBase } from '../../configs';

@Injectable({
  providedIn: 'root',
})
export class RouteHelperService {
  private router = inject(Router);
  private location = inject(Location);
  private auth = inject(CacBase.config.states.auth);
  private roleApi = inject(RoleApiService);

  private _initialized = false;
  private _allRoutes = signal<RouteItem[]>([]);
  private _currentRoutePermissionTree = signal<RoutePermission[] | undefined>(undefined);

  path = signal<string>('/');
  parentPath = signal<string | null>(null);
  childPath = signal<string | null>(null);

  allRoutes = this._allRoutes.asReadonly();
  currentRoutePermissionTree = this._currentRoutePermissionTree.asReadonly();

  routes = computed<RouteItem[]>(() => {
    const list = this.allRoutes();
    const perms = this.auth.permissionKeysSignal()?.map((t) => t.toLowerCase()) ?? [];
    const isLoggedIn = this.auth.isLoggedIn();

    if (this.auth.isSuper()) return list;

    return list
      .filter((t) =>
        isLoggedIn
          ? t.permission
            ? includes(
                perms,
                t.permission.keys.map((t) => t.toLowerCase()),
              )
            : true
          : !!t.visibleToGuest,
      )
      .map((t) => ({
        ...t,
        children: t.children?.filter((child) =>
          isLoggedIn
            ? child.permission
              ? includes(
                  perms,
                  child.permission?.keys.map((t) => t.toLowerCase()),
                )
              : true
            : !!child.visibleToGuest,
        ),
      }));
    //.filter((t) => (t.children?.length ?? 0) > 0);
  });
  parentIndex = computed(() => {
    const parent = this.parentPath();
    const child = this.childPath();
    const index = this.routes().findIndex((t) => t.path === parent || t.path === `${parent}/${child}`);
    return index >= 0 ? index : null;
  });
  parentItem = computed(() => arraySafeAt(this.routes(), this.parentIndex()));
  routeChildrenItems = computed<RouteItem[]>(() => this.parentItem()?.children ?? []);
  childIndex = computed(() => {
    const index = this.routeChildrenItems()?.findIndex((t) => t.path === this.childPath());
    return index >= 0 ? index : null;
  });
  childItem = computed(() => arraySafeAt(this.routeChildrenItems(), this.childIndex()));

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe((e) => {
      if (e instanceof ResolveStart) {
        this.getRoutePermissions(e.state.root);

        this.resolveRoutePath(e.url);
      } else if (e instanceof NavigationEnd) {
        if (!this._initialized) {
          this._initialized = true;
          this.getRoutePermissions(this.router.routerState.snapshot.root);
        }

        this.resolveRoutePath(e.urlAfterRedirects);
      }
    });

    this.updateConfig();
  }

  updateConfig() {
    this._allRoutes.set(this.parseRouteConfig(this.router.config) ?? []);
    this.resolveRoutePath(this.location.path());
  }

  getRoutePermissions(state?: ActivatedRouteSnapshot | null) {
    const permsTree: RoutePermission[] = [];
    let route = state?.root ?? null;
    let lastPermissionName: string | undefined;
    while (route) {
      const perm = (route?.routeConfig as RouteExtended)?.permissions;
      if (perm) {
        lastPermissionName = (typeof perm === 'string' ? perm : perm.name) ?? lastPermissionName;
        let keys: string[] | undefined;
        if (lastPermissionName && (typeof perm !== 'string' ? !perm.key : true)) {
          keys = this.roleApi.getPermissionKeysByAction(lastPermissionName, 'read');
        } else if (typeof perm !== 'string') {
          keys = perm!.key instanceof Array ? perm!.key : [perm!.key];
        }
        permsTree.push({
          name: lastPermissionName!,
          keys: keys ?? [],
        });
      }
      route = route.firstChild;
    }

    this._currentRoutePermissionTree.set(permsTree);
    return permsTree;
  }

  navigateByParent(route: RouteItem, childRoute?: RouteItem) {
    const path = route.path;
    let childPath: string | undefined = undefined;
    const navigatePath: string[] = [path];

    if (childRoute) {
      childPath = childRoute.path;
    } else {
      childPath = route.children?.at(0)?.path;
    }

    if (childPath) {
      navigatePath.push(childPath);
    }

    return this.router.navigate(navigatePath);
  }

  navigateByChild(route: RouteItem | string) {
    const path = (typeof route === 'string' ? route : route.path).split('/');
    return this.router.navigate([this.parentPath(), ...path]);
  }

  getFirstAllowedRoute() {
    const allowedRoutes = this.routes();
    const firstParent = allowedRoutes.at(0);
    const firstChild = firstParent?.children?.at(0);
    return firstParent && firstChild ? `${firstParent.path}/${firstChild.path}` : null;
  }

  private resolveRoutePath(urlPath: string) {
    const urlCleaned = urlPath.startsWith('/') ? urlPath.substring(1) : urlPath;
    this.path.set(urlCleaned);
    const split = urlCleaned.split('/');
    const parentRoute = split.length ? split[0] : null;
    const childRoute = split.length > 1 ? split[1] : null;
    this.parentPath.set(parentRoute);
    this.childPath.set(childRoute);
  }

  private parseRouteConfig(config: RoutesExtended | Routes): RouteItem[] | null {
    const mainEntry = config.find((t) => (isRouteExtended(t) ? t.layout === 'main' : null));
    if (!mainEntry) return null;

    const parentRoutes: RouteItem[] = [];
    for (const route of (mainEntry.children ?? []) as RoutesExtended) {
      if (route.redirectTo || !route.path) continue;

      const children = this.getRouteChildren(route);

      if (!children.length) continue;

      parentRoutes.push({
        ...this.routeToRouteItem(route),
        children,
      });
    }

    return parentRoutes;
  }

  private getRouteChildren(route: RouteExtended) {
    const transformer = (children: RouteExtended[] | undefined) => {
      const result: RouteItem[] = [];
      for (const item of children ?? []) {
        if (item.path === '' && item.children) {
          result.push(...transformer(item.children));
        // } else if (!!item.view && !!item.path && (item.remoteName ? this.plugins.isAvailable(item.remoteName) : true)) {
        } else if (!!item.view && !!item.path) {
          result.push(this.routeToRouteItem(item));
        }
      }
      return result;
    };

    return transformer(resolveRouteChildren(route));
  }

  private routeToRouteItem(route: RouteExtended): RouteItem {
    let permissionName: string | undefined = undefined;
    let permissionKey: string[] | undefined = undefined;
    if (route.permissions) {
      permissionName = typeof route.permissions === 'string' ? route.permissions : route.permissions.name;
      const rawKey = typeof route.permissions === 'string' ? undefined : route.permissions.key;
      permissionKey =
        !rawKey && !!permissionName
          ? this.roleApi.getPermissionKeysByAction(permissionName, 'read')
          : typeof rawKey === 'string'
            ? [rawKey]
            : rawKey;
    }

    return {
      path: route.path!,
      icon: route.view?.icon
        ? typeof route.view.icon === 'string'
          ? { default: route.view.icon }
          : route.view.icon
        : undefined,
      label: route.view?.label,
      permission: permissionName && permissionKey ? { name: permissionName, keys: permissionKey } : undefined,
      visibleToGuest: route.visibleToGuest,
    };
  }
}
