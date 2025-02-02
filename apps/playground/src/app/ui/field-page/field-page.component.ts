import { Component } from '@angular/core';
import { CacFieldComponent, formBuilder, CacFormBuilderComponent, formControl, Validators } from '@controladad/ng-base';
import { SectionComponent } from '../../section.component';

@Component({
  selector: 'app-field-page',
  imports: [CacFieldComponent, CacFormBuilderComponent, SectionComponent],
  templateUrl: './field-page.component.html',
  styleUrl: './field-page.component.scss',
})
export class FieldPageComponent {
  control = formControl('', [Validators.phone()]);

  form = formBuilder({
    inputs: {
      khiar: {
        control: formControl('', [Validators.phone()]),
      },
    },
  });
}
