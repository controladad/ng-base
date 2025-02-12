import { RouteExtended } from '@controladad/ng-base';

export const appRoutes: RouteExtended[] = [
  {
    path: 'button',
    loadComponent: () => import('./ui/button-page/button.component').then((m) => m.ButtonPageComponent),
  },
  {
    path: 'field',
    loadComponent: () => import('./ui/field-page/field-page.component').then((m) => m.FieldPageComponent),
  },
  {
    path: 'icon',
    loadComponent: () => import('./ui/icon-page/icon-page.component').then((m) => m.IconPageComponent),
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
  },
  {
    path: 'dialog',
    loadComponent: () => import('./features/dialog-page/dialog-page.component').then((m) => m.DialogPageComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login-page/login-page.component').then((m) => m.LoginPageComponent),
  },
  {
    path: 'one',
    layout: 'main',
    loadComponent: () => import('./section.component').then((m) => m.SectionComponent),
    children: [
      {
        path: 'two',
        view: { label: 'Two' },
        loadComponent: () => import('./section.component').then((m) => m.SectionComponent),
        children: [
          {
            path: 'three',
            view: { label: 'Three' },
            loadComponent: () => import('./section.component').then((m) => m.SectionComponent),
          },
          {
            path: 'triple',
            view: { label: 'Triple' },
            loadComponent: () => import('./section.component').then((m) => m.SectionComponent),
            children: [
              {
            path: 'forth',
            view: { label: 'Forth' },
            loadComponent: () => import('./section.component').then((m) => m.SectionComponent),
          },
            ]
          }
        ]
      },
      {
        path: 'duo',
        loadComponent: () => import('./section.component').then((m) => m.SectionComponent),
        children: [
          {
            path: 'trou',
            loadComponent: () => import('./section.component').then((m) => m.SectionComponent),
          },
          {
            path: 'triip',
            loadComponent: () => import('./section.component').then((m) => m.SectionComponent),
          }
        ]
      },
      {
        path: 'nii',
        loadComponent: () => import('./section.component').then((m) => m.SectionComponent),
        children: [
          {
            path: 'toobl',
            loadComponent: () => import('./section.component').then((m) => m.SectionComponent),
          },
          {
            path: 'tiii',
            loadComponent: () => import('./section.component').then((m) => m.SectionComponent),
          }
        ]
      }
    ]
  }
];
