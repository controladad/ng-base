import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'button',
    loadComponent: () => import('./ui/button-page/button.component').then((m) => m.ButtonPageComponent),
  },
  {
    path: 'checkbox',
    loadComponent: () => import('./ui/checkbox-page/checkbox-page.component').then((m) => m.CheckboxPageComponent),
  },
  {
    path: 'chips',
    loadComponent: () => import('./ui/chips-page/chips-page.component').then((m) => m.ChipsPageComponent),
  },
  {
    path: 'table',
    loadComponent: () => import('./features/table-page/table-page.component').then((m) => m.TablePageComponent),
  }
];
