import { Directive, ElementRef, Input, OnChanges, OnDestroy } from '@angular/core';
import tippy, { Instance } from 'tippy.js';

@Directive({
  selector: '[cacTooltip]',
  standalone: true,
})
export class TooltipDirective implements OnChanges, OnDestroy {
  @Input() uiTooltip?: string;
  @Input() uiTooltipShowByDefault?: boolean;
  @Input() uiTooltipType: 'error' | 'warning' | 'default' = 'default';

  tippyInstance?: Instance;
  baseClass = '';

  constructor(private host: ElementRef<HTMLElement>) {}

  ngOnChanges() {
    if (this.uiTooltip && !this.tippyInstance) {
      this.tippyInstance = tippy(this.host.nativeElement, {
        allowHTML: true,
        arrow: true,
        // interactive: true,
        hideOnClick: this.uiTooltipShowByDefault,
        animation: 'shift-away-extreme',
      });
      this.baseClass = this.tippyInstance.popper.className
    }

    if (!this.uiTooltip) {
      this.tippyInstance?.disable();
      return;
    } else {
      this.tippyInstance?.enable();
    }

    if (this.uiTooltipShowByDefault) {
      this.tippyInstance?.show();
    }

    const element = this.tippyInstance?.popper;
    if (element) {
      if (this.uiTooltipType === 'error') {
        element.className = `${this.baseClass} tippy-type-error`
      } else if (this.uiTooltipType === 'warning') {
        element.className = `${this.baseClass} tippy-type-warning`
      } else {
        element.className = `${this.baseClass}`
      }
    }

    this.tippyInstance?.setContent(this.uiTooltip);
  }

  ngOnDestroy() {
    this.tippyInstance?.destroy();
  }
}
