import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  LicensePlateComponent,
  OptionsTriggerDirective,
  SelectOptionsComponent,
} from '../../ui';
import { ItemRecords$ } from '../../../../core';
import { formControl } from '../../../forms';

@Component({
  selector: 'feature-license-plate-select',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    LicensePlateComponent,
    SelectOptionsComponent,
    OptionsTriggerDirective,
  ],
  templateUrl: './license-plate-select.component.html',
  styleUrls: ['./license-plate-select.component.scss'],
})
export class LicensePlateSelectComponent {
  @Input() control = formControl<string | undefined>(undefined);
  @Input() mini = false;
  @Input() items?: ItemRecords$<string>;
  @Input() label?: string;
  @Input() hideError = false;
}
