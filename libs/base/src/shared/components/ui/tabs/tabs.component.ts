import {
  ChangeDetectionStrategy,
  ContentChildren,
  Component,
  AfterViewInit,
  QueryList,
  signal, input
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTab, MatTabGroup, MatTabLabel } from '@angular/material/tabs';
import { NgTemplateOutlet } from '@angular/common';
import { CacTabComponent } from './tab.component';

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

  tabs = signal<CacTabComponent[]>([]);
  currentIndex = signal(0);

  ngAfterViewInit(): void {
    this.tabs.set(this.tabsQueryList?.toArray() ?? []);
  }
}
