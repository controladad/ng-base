import {
  Component,
  effect,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { IconComponent } from '../icon';
import { NgIf } from '@angular/common';

@Component({
  selector: 'ui-chips',
  standalone: true,
  imports: [IconComponent, NgIf],
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss'],
})
export class ChipsComponent<T> implements OnChanges {
  @Input() closable = false;
  @Input() active = false;
  @Input() value?: T;
  @Input() appearance: 'filled' | 'outlined' = 'filled';
  @Input('activeClass') activeClassNames?: string;

  @Output() onClose = new EventEmitter<MouseEvent>();
  @Output() onClick = new EventEmitter<MouseEvent>();

  @HostBinding('class.ui-chips') baseClass = true;
  @HostBinding('class.ui-chips-active') activeClass = false;
  @HostBinding('class.ui-chips-appearance-filled') appearanceFilledClass = true;
  @HostBinding('class.ui-chips-appearance-outlined') appearanceOutlinedClass = false;

  private _active = signal(false);

  constructor() {
    effect(() => {
      this.activeClass = this._active();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['active']) {
      this._active.set(this.active);
    }
    if (changes['appearance']) {
      this.appearanceFilledClass = this.appearance === 'filled';
      this.appearanceOutlinedClass = this.appearance === 'outlined';
    }
  }

  @HostListener('click', ['$event'])
  onChipsClick(e: MouseEvent) {
    e.stopPropagation();
    this.onClick.emit(e);
  }

  onCloseClick(e: MouseEvent) {
    e.stopPropagation();
    this.onClose.emit(e);
  }

  toggleActive(state?: boolean) {
    this._active.set(state !== undefined ? state : !this._active());
  }
}
