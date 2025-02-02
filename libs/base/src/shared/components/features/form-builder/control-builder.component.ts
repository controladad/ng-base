import { Component, computed, inject, input, Input } from '@angular/core';
import { AsyncPipe, NgStyle } from '@angular/common';
import { CacCheckboxComponent, CacFieldComponent, CacLicensePlateComponent, CacRadioComponent, CacSwitchComponent } from '../../ui';
import { FormBuilderInputOption } from './form-builder.types';
import { ScreenDetectorService } from '@al00x/screen-detector';

@Component({
  selector: 'cac-control-builder',
  standalone: true,
  imports: [
    CacRadioComponent,
    NgStyle,
    CacCheckboxComponent,
    CacSwitchComponent,
    CacLicensePlateComponent,
    CacFieldComponent,
    AsyncPipe,
  ],
  templateUrl: './control-builder.component.html',
  styleUrl: './control-builder.component.scss',
})
export class CacControlBuilderComponent<T> {
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
