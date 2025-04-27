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

let isBaseRegistered = false;
export function registerIcons(config?: {
  additionalIcons?: string[];
  additionalIconsDir?: string;
}) {
  const sanitizer = inject(DomSanitizer);
  const iconRegistry = inject(MatIconRegistry);

  if (!isBaseRegistered) {
    for (const icon of baseIcons) {
      iconRegistry.addSvgIcon(icon, sanitizer.bypassSecurityTrustResourceUrl(`./assets/base/icons/${icon}.svg`));
    }
    isBaseRegistered = true;
  }

  for (const icon of config?.additionalIcons ?? []) {
    let dir = config?.additionalIconsDir ?? `./assets/icons`;
    if (dir.endsWith('/')) {
      dir = dir.slice(0, -1);
    }
    iconRegistry.addSvgIcon(icon, sanitizer.bypassSecurityTrustResourceUrl(`${dir}/${icon}.svg`));
  }
}
