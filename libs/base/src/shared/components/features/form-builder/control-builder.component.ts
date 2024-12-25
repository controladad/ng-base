import { Component, computed, inject, input, Input } from '@angular/core';
import { AsyncPipe, NgIf, NgStyle, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { CheckboxComponent, FieldComponent, LicensePlateComponent, RadioComponent, SwitchComponent } from '../../ui';
import { FormBuilderInputOption } from './form-builder.types';
import { ScreenDetectorService } from '@al00x/screen-detector';
import { LicensePlateSelectComponent } from '../license-plate-select';

@Component({
  selector: 'feature-control-builder',
  standalone: true,
  imports: [
    NgIf,
    RadioComponent,
    NgSwitch,
    NgSwitchCase,
    NgStyle,
    CheckboxComponent,
    SwitchComponent,
    LicensePlateComponent,
    NgSwitchDefault,
    FieldComponent,
    AsyncPipe,
    LicensePlateSelectComponent,
  ],
  templateUrl: './control-builder.component.html',
  styleUrl: './control-builder.component.scss',
})
export class ControlBuilderComponent<T> {
  screenDetector = inject(ScreenDetectorService);

  @Input() class?: string;
  @Input() style: { [p: string]: any } = {};
  @Input() allowAutocomplete?: boolean;

  options = input.required<FormBuilderInputOption<T>>();

  protected input = computed(() => {
    return this.options();
    // return this.options() ?? (this.form() && this.key() ? this.form()!.inputs[this.key()!] : undefined);
  });
}
