import { Component } from '@angular/core';
import { SectionComponent } from '../../section.component';
import { CacChipsComponent, CacChipsGroupComponent } from '@controladad/ng-base';

@Component({
  selector: 'app-chips-page',
  imports: [SectionComponent, CacChipsComponent, CacChipsGroupComponent],
  templateUrl: './chips-page.component.html',
  styleUrl: './chips-page.component.scss',
})
export class ChipsPageComponent {}
