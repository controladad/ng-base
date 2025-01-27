import { Component } from '@angular/core';
import { SectionComponent } from '../../section.component';
import { ChipsComponent, ChipsGroupComponent } from '@controladad/ng-base';

@Component({
  selector: 'app-chips-page',
  imports: [SectionComponent, ChipsComponent, ChipsGroupComponent],
  templateUrl: './chips-page.component.html',
  styleUrl: './chips-page.component.scss',
})
export class ChipsPageComponent {}
