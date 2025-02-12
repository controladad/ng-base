import { _AppBaseStore, AppBaseStoreProps } from '@controladad/ng-base';
import { Injectable } from '@angular/core';

export interface AppStoreProps extends AppBaseStoreProps{
  shrinkSidebar?: boolean
}

@Injectable({
  providedIn: 'root'
})
export class AppStore extends _AppBaseStore<AppStoreProps> {
  constructor() {
    super({
      shrinkSidebar: false,
    });
  }
}
