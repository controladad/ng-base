import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  CacLicensePlateComponent,
  OptionsTriggerDirective,
  CacSelectOptionsComponent,
} from '../../ui';
import { ItemRecords$ } from '../../../../core';
import { formControl } from '@al00x/forms';

@Component({
  selector: 'cac-license-plate-select',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CacLicensePlateComponent,
    CacSelectOptionsComponent,
    OptionsTriggerDirective,
  ],
  templateUrl: './license-plate-select.component.html',
  styleUrls: ['./license-plate-select.component.scss'],
})
export class CacLicensePlateSelectComponent {
  @Input() control = formControl<string | undefined>(undefined);
  @Input() mini = false;
  @Input() items?: ItemRecords$<string>;
  @Input() label?: string;
  @Input() hideError = false;
}
