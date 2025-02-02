import { Component } from '@angular/core';
import { FieldComponent, formBuilder, FormBuilderComponent, formControl, Validators } from '@controladad/ng-base';
import { SectionComponent } from '../../section.component';

@Component({
  selector: 'app-field-page',
  imports: [FieldComponent, FormBuilderComponent, SectionComponent],
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
