import { Component, inject, Input } from '@angular/core';
import { RouteHelperService } from '@controladad/ng-base';

@Component({
  selector: 'app-test-section',
  standalone: true,
  imports: [],
  template: `
    <div class="flex flex-col mt-12 border-y-2 py-8 px-12 border-gray-300 items-center">
      <p class="text-4xl font-medium text-center">{{ title }}</p>
      <div class="flex flex-wrap justify-center items-baseline gap-12 mt-16">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [``],
})
export class SectionComponent {
  @Input() title = '';

  routeHelper = inject(RouteHelperService);

  constructor() {
    console.log(this.routeHelper.routeParts())
  }
}
