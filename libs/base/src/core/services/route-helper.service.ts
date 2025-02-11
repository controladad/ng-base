import { computed, inject, Injectable, signal } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, ResolveStart, Router, Routes } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouteExtended, RouteItem, RoutePermission, RoutesExtended } from '../interfaces';
import { Location } from '@angular/common';
import { isRouteExtended } from '../helpers';
import { AuthBaseStore } from '../states';

// TODO: Fix Permissions

@Injectable({
  providedIn: 'root',
})
export class RouteHelperService {
  private router = inject(Router);
  private location = inject(Location);
  private auth = inject(AuthBaseStore);

  private _initialized = false;
  private _allRoutes = signal<RouteItem[]>([]);
  private _currentRoutePermissionTree = signal<RoutePermission[] | undefined>(undefined);

  path = signal<string>('/');
  routeParts = signal<string[]>([]);
  layout = signal<RouteExtended>(null as any);
  layoutRootPath = signal<string>('/');

  allRoutes = this._allRoutes.asReadonly();
  currentRoutePermissionTree = this._currentRoutePermissionTree.asReadonly();

  routes = computed(() => this.filterRoutes(this.allRoutes()));

  routeItems = computed(() => {
    return this.getRouteItems();
  });

  urls = computed(() => this.getUrls(this.routes()));

  constructor() {
    this.setupRouterEvents();
    this.updateConfig();
  }

  private setupRouterEvents() {
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
  }

  private updateConfig() {
    this._allRoutes.set(this.parseRouteConfig(this.router.config) ?? []);
    this.resolveRoutePath(this.location.path());
  }

  getRoutePermissions(state?: ActivatedRouteSnapshot | null) {
    const permsTree: RoutePermission[] = [];
    // let route = state?.root ?? null;
    // let lastPermissionName: string | undefined;

    // while (route) {
    //   const perm = (route?.routeConfig as RouteExtended)?.permissions;
    //   if (perm) {
    //     lastPermissionName = (typeof perm === 'string' ? perm : perm.name) ?? lastPermissionName;
    //     let keys: string[] | undefined;
    //
    //     if (lastPermissionName && (typeof perm !== 'string' ? !perm.key : true)) {
    //       keys = this.roleApi.getPermissionKeysByAction(lastPermissionName, 'read');
    //     } else if (typeof perm !== 'string') {
    //       keys = perm!.key instanceof Array ? perm!.key : [perm!.key];
    //     }
    //
    //     permsTree.push({
    //       name: lastPermissionName!,
    //       keys: keys ?? [],
    //     });
    //   }
    //   route = route.firstChild;
    // }

    this._currentRoutePermissionTree.set(permsTree);
    return permsTree;
  }

  navigate(pathOrItem: string | string[] | RouteItem) {
    const pathArray = Array.isArray(pathOrItem)
      ? pathOrItem
      : typeof pathOrItem === 'object'
        ? pathOrItem.fullPath.split('/')
        : pathOrItem.split('/');
    pathArray.unshift('/');
    return this.router.navigate(pathArray);
  }

  private getRoutesAtLevel(level: number): RouteItem[] {
    let currentRoutes = this.routes();
    if (currentRoutes.length === 0) return [];

    for (let i = 0; i < level; i++) {
      currentRoutes = currentRoutes[0].children || [];
    }
    return currentRoutes;
  }

  private buildRouteTree(item: RouteItem | undefined): string[] {
    const routeParts = item?.fullPath.split('/') ?? [];
    routeParts.unshift('/');
    return routeParts;
  }

  private buildRouteUrl(item: RouteItem | undefined): string {
    const tree = this.buildRouteTree(item);
    tree.shift();
    return tree.join('/');
  }

  // if no url parameter is provided, the current url will be used
  getRouteItemAtLevel(level: number, url?: string): RouteItem | undefined {
    return (url ? this.getRouteItems(url) : this.routeItems())[level];
  }

  // if no url parameter is provided, the current url will be used
  getRouteChildrenAtLevel(level: number, url?: string) {
    return this.getRouteItemAtLevel(level, url)?.children ?? [];
  }

  // if no url parameter is provided, the current url will be used
  getRoutePathAtLevel(level: number, url?: string): string | undefined {
    return (url ? this.getRouteParts(url) : this.routeParts())[level];
  }

  getFirstAllowedRoute(): string | null {
    const findFirstAllowedChild = (routes: RouteItem[]): string | null => {
      for (const route of routes) {
        if (route.children?.length) {
          const childPath = findFirstAllowedChild(route.children);
          if (childPath) return `${route.path}/${childPath}`;
        }
        return route.path;
      }
      return null;
    };

    return findFirstAllowedChild(this.routes());
  }

  private resolveRoutePath(urlPath: string) {
    this.path.set(this.cleanupRouteUrl(urlPath));
    this.routeParts.set(this.getRouteParts(urlPath));
  }

  private cleanupRouteUrl(url: string) {
    return url.startsWith('/') ? url.substring(1) : url;
  }

  private getRouteParts(url: string) {
    return this.cleanupRouteUrl(url).split('/').filter(Boolean);
  }

  private parseRouteConfig(config: RoutesExtended | Routes): RouteItem[] | null {
    const mainEntry = config.find((t) => isRouteExtended(t) && t.layout === 'main') as RouteExtended;

    this.layout.set(mainEntry);
    this.layoutRootPath.set(mainEntry.path ? mainEntry.path.startsWith('/') ? mainEntry.path : `/${mainEntry.path}` : '/')

    return mainEntry ? this.getRouteChildren(mainEntry) : null;
  }

  private getRouteChildren(route: RouteExtended): RouteItem[] {
    const rootPath = this.layoutRootPath();

    const processRoute = (item: RouteExtended, level = 0, parent?: RouteItem): RouteItem | null => {
      if (item.redirectTo || (!item.path && !item.children) || !item.view) return null;

      const routeItem = this.routeToRouteItem(item, level, parent, rootPath);
      if (item.children) {
        routeItem.children = item.children
          .map((t) => processRoute(t, level + 1, routeItem))
          .filter((child): child is RouteItem => child !== null);
      }

      return routeItem;
    };

    return (route.children ?? []).map((t) => processRoute(t)).filter((item): item is RouteItem => item !== null);
  }

  private routeToRouteItem(route: RouteExtended, level: number, parent?: RouteItem, rootPath?: string): RouteItem {
    const { permissionName, permissionKey } = this.extractPermissions(route);

    return {
      fullPath: `${parent?.fullPath ?? rootPath}/${route.path}`,
      path: route.path!,
      level,
      icon: this.extractIcon(route),
      label: route.view?.label,
      permission: permissionName && permissionKey ? { name: permissionName, keys: permissionKey } : undefined,
      visibleToGuest: route.visibleToGuest,
      children: [],
      parent,
      isPlaceholder: !route.component && !route.loadComponent,
      permittedRoles: route.permittedRoles,
      hidden: !route.view,
    };
  }

  private extractPermissions(route: RouteExtended): { permissionName?: string; permissionKey?: string[] } {
    // if (!route.permissions) return {};
    //
    // const permissionName = typeof route.permissions === 'string' ? route.permissions : route.permissions.name;
    // const rawKey = typeof route.permissions === 'string' ? undefined : route.permissions.key;
    //
    // const permissionKey =
    //   !rawKey && permissionName
    //     ? this.roleApi.getPermissionKeysByAction(permissionName, 'read')
    //     : typeof rawKey === 'string'
    //     ? [rawKey]
    //     : rawKey;
    //
    // return { permissionName, permissionKey };
    return { permissionName: undefined, permissionKey: undefined };
  }

  private extractIcon(route: RouteExtended) {
    return route.view?.icon
      ? typeof route.view.icon === 'string'
        ? { default: route.view.icon }
        : route.view.icon
      : undefined;
  }

  // if no route parameter is provided, the current route will be used
  private getRouteItems(route?: string) {
    const parts = route ? this.getRouteParts(route) : this.routeParts();
    let currentItems = this.routes();
    const items: RouteItem[] = [];

    parts.forEach((part) => {
      const item = currentItems.find((r) => r.path === part);
      if (item) {
        items.push(item);
        currentItems = item.children || [];
        item.children?.forEach((r) => items.push(r));
      }
    });

    return items;
  }

  private filterRoutes(routes: RouteItem[]): RouteItem[] {
    return routes;

    // const filteredRoutes: RouteItem[] = [];
    // const mappedRoutes = (this.auth.permissionKeysSignal() ?? []).map(x => x.permissions);
    // const userPermissions = mappedRoutes.length ? mappedRoutes.reduce((prev, cur) => prev.concat(cur)) : [];
    // routes.forEach(route => {
    //   if (!route.permittedRoles || route.permittedRoles.find(x => userPermissions.includes(x))) {
    //     const filteredChildren = route.children ? this.filterRoutes(route.children) : undefined;
    //     filteredRoutes.push({...route, children: filteredChildren});
    //   }
    // });
    // return filteredRoutes;

    // const perms = this.auth.permissionKeysSignal()?.map(t => t.toLowerCase()) ?? [];
    // const isLoggedIn = this.auth.isLoggedIn();

    // const filterRoute = (route: RouteItem): RouteItem | null => {
    //   const isVisible = isLoggedIn
    //     ? route.permission
    //       ? includes(perms, route.permission.keys.map(t => t.toLowerCase()))
    //       : true
    //     : !!route.visibleToGuest;

    //   if (!isVisible) return null;

    //   const filteredChildren = route.children
    //     ?.map(filterRoute)
    //     .filter((child): child is RouteItem => child !== null) ?? [];

    //   return { ...route, children: filteredChildren };
    // };

    // return routes.map(filterRoute).filter((route): route is RouteItem => route !== null);
  }

  private getUrls(routeItems: RouteItem[]): string[] {
    const urls: string[] = [];
    routeItems.forEach((item) => {
      urls.push(`/${item.path}`);
      (item.children ?? [])?.map((child) => {
        urls.push(`/${item.path}/${child.path}`);
        if (child.children) {
          const grandChidRoutes = this.getUrls(child.children);
          urls.push(...grandChidRoutes);
        }
      });
    });
    return urls;
  }
}
