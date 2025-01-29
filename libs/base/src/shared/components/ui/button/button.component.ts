import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  signal,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgStyle, NgTemplateOutlet } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { pipe, tap, UnaryFunction } from 'rxjs';
import { ActionTypes, RoleService, startWithTap } from '../../../../core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IconComponent } from '../icon';

export interface ButtonClickEvent {
  event: MouseEvent;
  // If state is not provided, it will be toggled
  setLoading: (state?: boolean) => void;
  pipe: <T>() => UnaryFunction<T, T>;
}

export type ButtonAppearanceType = 'stroked' | 'filled' | 'text';

export type ButtonThemeType = 'primary' | 'secondary' | 'tertiary' | 'error' | 'custom';

@Component({
  selector: 'ui-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    RouterLink,
    MatProgressSpinnerModule,
    NgTemplateOutlet,
    MatIconModule,
    NgStyle,
    MatTooltipModule,
    IconComponent
],
})
export class ButtonComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('Button', { read: ElementRef }) btnElement?: ElementRef<HTMLButtonElement>;

  @Input() icon?: string;
  @Input() iconPosition: 'prefix' | 'suffix' = 'prefix';
  @Input() appearance: ButtonAppearanceType = 'filled';
  @Input() tonal = false;
  @Input() elevated = false;
  @Input() theme: ButtonThemeType = 'primary';
  @Input() disabled?: boolean | null = false;
  @Input('loading') loadingProp?: boolean = false;
  @Input() iconSize = '1.5rem';
  @Input() padding = '0.5rem 1rem';
  @Input() fitContent = false;
  @Input() align?: 'start' | 'end' | 'center' = 'center';
  // Navigate to the given route on click
  @Input() route?: string[];
  // TabIndex
  @Input() tab = 0;
  // Permission key
  @Input() permission?: string;
  // The action associated to a permission related to the current route
  @Input() action?: ActionTypes | ActionTypes[];

  @Output() onClick = new EventEmitter<ButtonClickEvent>();

  @HostBinding('class.filled') filledClass = true;
  @HostBinding('class.stroked') strokedClass = false;
  @HostBinding('class.text') textClass = false;
  @HostBinding('class.elevated') isElevated = false;
  @HostBinding('class.tonal') isTonal = false;
  @HostBinding('class.is-clicking') isClicking = false;
  @HostBinding('class.theme-primary') primaryClass = false;
  @HostBinding('class.theme-secondary') secondaryClass = false;
  @HostBinding('class.theme-tertiary') tertiaryClass = false;
  @HostBinding('class.theme-error') errorClass = false;
  @HostBinding('class.disabled') disabledClass = false;
  @HostBinding('class.cursor-not-allowed') cursorNotAllowed = false;

  loading = signal(false);
  insufficientPermission = signal(false);

  constructor(private role: RoleService) {
    toObservable(this.insufficientPermission)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.setDisabledClass();
      });
  }

  ngOnInit() {
    this.setTheme();
    this.checkPermission();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      // Angular... doesn't bind tabIndex in template!
      this.btnElement!.nativeElement.tabIndex = this.tab;
    }, 5);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['loading']) {
      this.loading.set(this.loadingProp ?? false);
    }
    if (changes['appearance']) {
      this.strokedClass = this.appearance === 'stroked';
      this.filledClass = this.appearance === 'filled';
      this.textClass = this.appearance === 'text';
    }
    if (changes['theme']) {
      this.setTheme();
    }
    if (changes['elevated']) {
      this.isElevated = this.elevated;
    }
    if (changes['tonal']) {
      this.isTonal = this.tonal;
    }
    this.setDisabledClass();
  }

  @HostListener('pointerdown', ['$event'])
  onPointerDown() {
    this.isClicking = true;
  }
  @HostListener('pointercancel', ['$event'])
  onPointerCancel() {
    this.isClicking = false;
  }
  @HostListener('pointerleave', ['$event'])
  onPointerLeave() {
    this.isClicking = false;
  }
  @HostListener('pointerup', ['$event'])
  onPointerUp() {
    this.isClicking = false;
  }

  onClickEvent(e: MouseEvent) {
    if (this.loadingProp || this.disabled || this.insufficientPermission() || this.loading()) return;

    this.onClick.emit(this.createClickEvent(e));
  }

  createClickEvent(mouseEvent: MouseEvent | undefined) {
    const e = {
      event: mouseEvent ?? new Event('click'),
      setLoading: (state) => {
        this.loading.set(state !== undefined ? state : !this.loading());
      },
      pipe: () =>
        pipe(
          startWithTap(() => e.setLoading(true)),
          tap({
            next: () => e.setLoading(false),
            error: () => e.setLoading(false),
            complete: () => e.setLoading(false),
          }),
        ),
    } as ButtonClickEvent;
    return e;
  }

  private setTheme() {
    this.primaryClass = false;
    this.secondaryClass = false;
    this.tertiaryClass = false;
    this.errorClass = false;
    if (this.theme === 'custom') return;
    this[`${this.theme}Class`] = true;
  }

  private checkPermission() {
    if (!this.action && !this.permission) return;

    this.insufficientPermission.set(
      this.permission ? !this.role.hasPermission(this.permission) : !this.role.hasActionPermission(this.action),
    );
  }

  private setDisabledClass() {
    const insufficientPermission = this.insufficientPermission();
    this.disabledClass = (this.disabled ?? false) || insufficientPermission;

    if (insufficientPermission) {
      this.cursorNotAllowed = true;
    } else {
      this.cursorNotAllowed = false;
    }
  }
}
