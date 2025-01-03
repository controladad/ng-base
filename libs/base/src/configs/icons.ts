import { inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

// prettier-ignore
const baseIcons = [
  'add', 'arrow-down', 'arrow-up', 'arrow-left', 'arrow-right', 'calendar', 'camera', 'check', 'check-double',
  'chevron-down', 'chevron-left', 'chevron-right', 'chevron-up', 'clock', 'close', 'delete', 'dropdown', 'edit',
  'edit-box', 'error', 'excel-file', 'eye', 'eye-slash', 'filter', 'filter-filled', 'hashtag', 'info', 'info-circle',
  'list', 'location', 'location-check', 'login', 'logout', 'menu', 'nav', 'numeric-down', 'numeric-up', 'paper',
  'paper-details', 'password', 'phone', 'plate', 'play', 'plus', 'power', 'print', 'question-circle', 'refresh',
  'reports', 'save', 'search', 'settings', 'sort', 'sort-down', 'sort-up', 'time', 'trash', 'trash-alt', 'user',
  'user-circle', 'users', 'wrench'
] as const;

export type BASE_ICONS = (typeof baseIcons)[number];

export function registerIcons(icons?: string[]) {
  const sanitizer = inject(DomSanitizer);
  const iconRegistry = inject(MatIconRegistry);

  for (const icon of baseIcons) {
    iconRegistry.addSvgIcon(icon, sanitizer.bypassSecurityTrustResourceUrl(`./assets/base/icons/${icon}.svg`));
  }

  for (const icon of icons ?? []) {
    iconRegistry.addSvgIcon(icon, sanitizer.bypassSecurityTrustResourceUrl(`./assets/icons/${icon}.svg`));
  }
}
