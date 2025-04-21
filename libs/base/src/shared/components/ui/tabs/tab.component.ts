import { Component, input, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'cac-tab',
  standalone: true,
  imports: [],
  template: `<ng-template><ng-content></ng-content></ng-template>`,
  styles: ``,
})
export class CacTabComponent {
  @ViewChild(TemplateRef) content!: TemplateRef<any>;
  label = input.required<string>();
  icon = input<string>();
}
