import {
  ChangeDetectionStrategy,
  ContentChildren,
  Component,
  AfterViewInit,
  QueryList,
  signal, input, output
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTab, MatTabGroup, MatTabLabel } from '@angular/material/tabs';
import { NgTemplateOutlet } from '@angular/common';
import { CacTabComponent } from './tab.component';

export interface CacTabTabChangeEvent {
  index: number;
  tab: CacTabComponent;
}

@Component({
  selector: 'cac-tabs',
  standalone: true,
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTabGroup, MatTab, MatTabLabel, MatIcon, NgTemplateOutlet],
})
export class CacTabsComponent implements AfterViewInit {
  @ContentChildren(CacTabComponent) tabsQueryList?: QueryList<CacTabComponent>;

  dynamicHeight = input(true);

  onTabChange = output<CacTabTabChangeEvent>();

  tabs = signal<CacTabComponent[]>([]);
  currentIndex = signal(0);

  ngAfterViewInit(): void {
    this.tabs.set(this.tabsQueryList?.toArray() ?? []);
  }

  tabChange(index: number) {
    this.currentIndex.set(index);
    this.onTabChange.emit({ index, tab: this.tabs()[index] });
  }
}
