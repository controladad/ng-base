import { Component } from '@angular/core';
import { SectionComponent } from '../../section.component';
import { CheckboxComponent } from '@cac/base';

@Component({
  selector: 'app-checkbox-page',
  standalone: true,
  imports: [SectionComponent, CheckboxComponent],
  templateUrl: './checkbox-page.component.html',
  styleUrl: './checkbox-page.component.scss',
})
export class CheckboxPageComponent {}
