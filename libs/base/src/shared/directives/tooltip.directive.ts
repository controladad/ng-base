import { Directive, ElementRef, Input, OnChanges, OnDestroy } from '@angular/core';
import tippy, { Instance } from 'tippy.js';

@Directive({
  selector: '[uiTooltip]',
  standalone: true,
})
export class TooltipDirective implements OnChanges, OnDestroy {
  @Input() uiTooltip?: string;

  tippyInstance?: Instance;

  constructor(private host: ElementRef<HTMLElement>) {}

  ngOnChanges() {
    if (this.uiTooltip && !this.tippyInstance) {
      this.tippyInstance = tippy(this.host.nativeElement, {
        allowHTML: true,
        arrow: true,
      });
    }
    if (!this.uiTooltip) {
      this.tippyInstance?.disable();
      return;
    } else {
      this.tippyInstance?.enable();
    }

    this.tippyInstance?.setContent(this.uiTooltip);
  }

  ngOnDestroy() {
    this.tippyInstance?.destroy();
  }
}
