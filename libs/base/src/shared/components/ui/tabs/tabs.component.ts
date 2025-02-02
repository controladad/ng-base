import {
  ChangeDetectionStrategy,
  ContentChildren,
  Component,
  Input,
  AfterViewInit,
  TemplateRef,
  QueryList,
  ElementRef,
  WritableSignal,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { NgTemplateOutlet } from '@angular/common';

export interface TabItem {
  label: string;
  bodySlot: string;
  icon?: string;
}

@Component({
  selector: 'cac-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  standalone: true,
  imports: [MatTabsModule, MatIconModule, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CacTabsComponent implements AfterViewInit {
  @Input() tabs: WritableSignal<TabItem[]> = signal([]);
  @Input() hasIcon = true;
  @ContentChildren('content') allBody?: QueryList<TemplateRef<ElementRef>>;
  contents?: TemplateRef<ElementRef>[];
  currentIndex = 0;

  ngAfterViewInit(): void {
    this.contents = this.allBody?.toArray();
  }
}
