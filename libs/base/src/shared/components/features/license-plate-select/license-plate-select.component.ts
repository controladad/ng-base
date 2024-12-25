import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import {
  ControlErrorComponent,
  LicensePlateComponent,
  OptionsTriggerDirective,
  SelectOptionsComponent,
} from '../../ui';
import { formControl, ItemRecords$ } from '../../../../core';

@Component({
  selector: 'feature-license-plate-select',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    AsyncPipe,
    ControlErrorComponent,
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
