import { Component } from '@angular/core';
import { ButtonComponent } from '@controladad/ng-base';
import { SectionComponent } from '../../section.component';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [ButtonComponent, SectionComponent],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonPageComponent {}
