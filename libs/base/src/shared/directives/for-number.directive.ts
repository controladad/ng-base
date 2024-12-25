import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[forNumber]',
  standalone: true,
})
export class ForNumberDirective {
  constructor(
    private templateRef: TemplateRef<never>,
    private viewContainer: ViewContainerRef,
  ) {}

  @Input('forNumber') set count(count: number) {
    this.viewContainer.clear();
    for (let i = 0; i < count; i++) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
