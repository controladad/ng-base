import { Class, RouteExtended } from '../interfaces';

export async function lazyLoad<T extends object>(component: Promise<T>, selector?: (o: T) => Class): Promise<Class> {
  const entry = await component;
  if (selector) return selector(entry);
  const props = Object.values(entry);
  if (props.length) return props[0] as Class;
  console.error('LAZY LOAD ERROR', entry);
  throw new Error('Entry has no exported components!!');
}

export function resolveRouteChildren(route: RouteExtended) {
  if (route.children) return route.children;
  // _loadedRoutes is a private property of Route which holds the list of lazy loaded routes config. we need to use it!
  // @ts-ignore
  if (route._loadedRoutes) return route._loadedRoutes;
}

export function isRouteExtended(r: RouteExtended): r is RouteExtended {
  return 'layout' in r;
}
