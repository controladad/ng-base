import { AfterViewInit, DestroyRef, Directive, ElementRef, inject, Input, OnInit } from '@angular/core';
import { CacSelectOptionsComponent } from './select-options.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';

@Directive({
  selector: '[uiOptionsTriggerFor]',
  standalone: true,
})
export class OptionsTriggerDirective implements OnInit, AfterViewInit {
  destroyRef = inject(DestroyRef);

  @Input() uiOptionsTriggerFor?: CacSelectOptionsComponent<any>;
  @Input() selector: 'self' | 'input' = 'input';
  @Input() filter = false;

  preventMenuOpen = false;
  preventMenuClose = false;

  private _selectorEl!: HTMLInputElement | undefined;
  private _previouslyActivatedEl?: Element | undefined | null;

  constructor(private host: ElementRef<HTMLInputElement>) {}

  ngOnInit() {
    const host = this.host?.nativeElement;
    if (!host) return;

    this.getSelectorEl();
  }

  ngAfterViewInit() {
    if (!this._selectorEl) this.getSelectorEl();

    if (!this.uiOptionsTriggerFor || !this._selectorEl) return;

    this.host.nativeElement.style.cursor = 'pointer';

    if (this.filter) {
      this.uiOptionsTriggerFor.setElementToFocus(this._selectorEl);
    }

    fromEvent(window, 'blur')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this._previouslyActivatedEl = document.activeElement;
      });

    fromEvent(this._selectorEl!, 'click')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.openMenu();
      });

    fromEvent(this._selectorEl!, 'focus')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this._previouslyActivatedEl === document.activeElement) return;
        this.openMenu();
      });

    fromEvent(this._selectorEl!, 'blur')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this._previouslyActivatedEl = undefined;
      });

    fromEvent<KeyboardEvent>(this._selectorEl!, 'keydown')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((e) => {
        if (e.key === 'Enter' && !e.defaultPrevented) {
          e.stopPropagation();
          setTimeout(() => {
            this.openMenu();
          }, 10);
        }
      });

    this.uiOptionsTriggerFor.menuClosed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.preventOpenTemporary();
      this._selectorEl!.focus();
    });
  }

  private getSelectorEl() {
    const host = this.host?.nativeElement;
    if (!host) return;
    if (this.selector === 'input') {
      const nearestInput = 'value' in host ? host : (host as HTMLElement).querySelector('input');
      this._selectorEl = nearestInput ?? undefined;
    } else {
      this._selectorEl = host;
    }
  }

  private openMenu() {
    if (!this.uiOptionsTriggerFor) return;

    if (this.preventMenuOpen || this.uiOptionsTriggerFor.trigger.menuOpen) return;
    this.preventCloseTemporary();
    this.uiOptionsTriggerFor.open();
  }

  private preventOpenTemporary() {
    this.preventMenuOpen = true;
    setTimeout(() => {
      this.preventMenuOpen = false;
    }, 5);
  }
  private preventCloseTemporary() {
    this.preventMenuClose = true;
    setTimeout(() => {
      this.preventMenuClose = false;
    }, 5);
  }
}
