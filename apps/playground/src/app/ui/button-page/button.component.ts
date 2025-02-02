import { Component } from '@angular/core';
import { CacButtonComponent, PermissionHideDirective } from '@controladad/ng-base';
import { SectionComponent } from '../../section.component';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CacButtonComponent, SectionComponent, PermissionHideDirective],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonPageComponent {}
