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
  ViewChild,
  AfterViewInit,
  InjectionToken,
} from '@angular/core';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { NgStyle } from '@angular/common';
import { BASE_ICONS } from '../../../../configs';
import { Subscription } from 'rxjs';
import { componentWithDefaultConfig } from '../../../../core';

export type IconComponentType = InstanceType<typeof IconComponent>
export const ICON_COMPONENT_CONFIG = new InjectionToken<Partial<IconComponentType>>('IconComponent');

@Component({
  selector: 'ui-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  standalone: true,
  imports: [MatIconModule, NgStyle],
})
export class IconComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('MatIcon') matIcon!: MatIcon;

  @Input() icon?: BASE_ICONS | string;
  @Input() disabled = false;
  @Input() size = '1.5rem';
  @Input() strokeWidth = 1.9;
  @Input() iconClass?: string;
  @Input() wrapperClass?: string;
  @Output() onClick = new EventEmitter<MouseEvent>();

  @HostBinding('class.pointer-events-none') pointerEventsNone = false;
  @HostBinding('style.width') thisWidth = '';
  @HostBinding('style.height') thisHeight = '';

  isClickable = signal(false);

  constructor() {
    componentWithDefaultConfig(this, ICON_COMPONENT_CONFIG);

    this.thisWidth = this.size;
    this.thisHeight = this.size;
  }

  ngOnInit() {
    this.isClickable.set(this.onClick.observed);
  }

  ngAfterViewInit() {
    // @ts-ignore
    const fetchSub = this.matIcon._currentIconFetch as Subscription;
    fetchSub.add(() => {
      const svgElement = this.matIcon._elementRef.nativeElement.children.item(0) as SVGElement;
      svgElement.style.strokeWidth = `${this.strokeWidth}`;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['disabled']) {
      this.pointerEventsNone = this.disabled;
    }
    if (changes['size']) {
      this.thisWidth = this.size;
      this.thisHeight = this.size;
    }
  }

  onClickEvent(e: MouseEvent) {
    if (this.disabled) return;

    this.onClick.emit(e);
  }
}
