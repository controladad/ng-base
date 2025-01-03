import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  HostBinding,
  Output,
  EventEmitter,
  OnInit,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgIf, NgStyle } from '@angular/common';
import { BASE_ICONS } from '../../../../configs';

@Component({
  selector: 'ui-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  standalone: true,
  imports: [MatIconModule, NgIf, NgStyle],
})
export class IconComponent implements OnInit, OnChanges {
  @Input() icon?: BASE_ICONS | string;
  @Input() disabled = false;
  @Input() size = '1.5rem';
  @Input() iconClass?: string;
  @Input() wrapperClass?: string;
  @Output() onClick = new EventEmitter<MouseEvent>();
  @HostBinding('class.pointer-events-none') pointerEventsNone = false;

  isClickable = signal(false);

  ngOnInit() {
    this.isClickable.set(this.onClick.observed);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['disabled']) {
      this.pointerEventsNone = this.disabled;
    }
  }

  onClickEvent(e: MouseEvent) {
    if (this.disabled) return;

    this.onClick.emit(e);
  }
}
