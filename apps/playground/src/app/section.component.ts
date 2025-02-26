import { Component, inject, Input } from '@angular/core';
import { ENVIRONMENT, RouteHelperService } from '@controladad/ng-base';

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
      <button (click)="onTest1()">test navigate</button>
    </div>
  `,
  styles: [``],
})
export class SectionComponent {
  @Input() title = '';

  routeHelper = inject(RouteHelperService);

  constructor() {
    console.log(this.routeHelper.pathChunks());
    console.log(this.routeHelper.routes());
    console.log(inject(ENVIRONMENT));
  }

  onTest1() {
    // this.routeHelper.isActive(this.routeHelper.routes()[0].children![1])
  }
}
