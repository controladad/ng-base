import { AfterViewInit, Directive, ElementRef, EventEmitter, Host, Input, OnDestroy, Output } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[ngIsInView]',
  standalone: true,
})
export class NgIsInViewDirective implements AfterViewInit, OnDestroy {
  @Input() emitViewEventOnce = false;

  // If returned true, it means the element has entered the view
  @Output() onIsVisibleChanged = new EventEmitter<boolean>();

  private _observer?: IntersectionObserver;

  constructor(@Host() private _elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    const options = { root: null, rootMargin: '0px', threshold: 0.0 };
    this._observer = new IntersectionObserver((entries) => {
      const entry = entries.at(0);
      if (!entry) return;
      this.onIsVisibleChanged.emit(entry.isIntersecting);
      if (entry.isIntersecting && this.emitViewEventOnce) {
        this.disconnectObserver();
      }
    }, options);
    this._observer.observe(this._elementRef.nativeElement);
  }

  ngOnDestroy() {
    this.disconnectObserver();
  }

  private disconnectObserver() {
    this._observer?.disconnect();
  }
}
