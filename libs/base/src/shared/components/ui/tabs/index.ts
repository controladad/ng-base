import { NgModule } from '@angular/core';
import { CacTabsComponent } from './tabs.component';
import { CacTabComponent } from './tab.component';

export * from './tab.component';
export * from './tabs.component';

@NgModule({
  imports: [CacTabsComponent, CacTabComponent],
  exports: [CacTabsComponent, CacTabComponent],
})
export class CacTabsModule {}
