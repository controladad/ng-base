import {
  Component,
  effect,
  EventEmitter,
  HostBinding,
  HostListener,
  InjectionToken,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { CacIconComponent } from '../icon';
import { componentWithDefaultConfig } from '../../../../core';


// TODO: activeClass property is not working

export type ChipsComponentType = InstanceType<typeof CacChipsComponent>
export const CHIP_COMPONENT_CONFIG = new InjectionToken<Partial<ChipsComponentType>>('CacChipsComponent');

@Component({
  selector: 'cac-chips',
  standalone: true,
  imports: [CacIconComponent],
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss'],
})
export class CacChipsComponent<T> implements OnChanges {
  @Input() closable = false;
  // active is used as a flag and has no behavioral significance
  @Input() active = false;
  @Input() value?: T;
  @Input() appearance: 'filled' | 'outlined' = 'filled';
  @Input() icon?: string;
  @Input('activeClass') activeClass?: string;

  @Output() onClose = new EventEmitter<MouseEvent>();
  @Output() onClick = new EventEmitter<MouseEvent>();

  @HostBinding('class.ui-chips') baseClassBinding = true;
  @HostBinding('class.ui-chips-active') activeClassBinding = false;
  @HostBinding('class.ui-chips-appearance-filled') appearanceFilledClassBinding = true;
  @HostBinding('class.ui-chips-appearance-outlined') appearanceOutlinedClassBinding = false;

  private _active = signal(false);

  constructor() {
    componentWithDefaultConfig(this, CHIP_COMPONENT_CONFIG);

    effect(() => {
      this.activeClassBinding = this._active();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['active']) {
      this._active.set(this.active);
    }
    if (changes['appearance']) {
      this.appearanceFilledClassBinding = this.appearance === 'filled';
      this.appearanceOutlinedClassBinding = this.appearance === 'outlined';
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
