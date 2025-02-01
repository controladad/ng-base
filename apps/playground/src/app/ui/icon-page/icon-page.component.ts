import { Component } from '@angular/core';
import { IconComponent } from '@controladad/ng-base';
import { SectionComponent } from '../../section.component';

@Component({
  selector: 'app-icon-page',
  imports: [SectionComponent, IconComponent],
  templateUrl: './icon-page.component.html',
  styleUrl: './icon-page.component.scss',
})
export class IconPageComponent {
  test() {
    console.log('clicked')
  }
}
