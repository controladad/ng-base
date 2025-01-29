import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'ui-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatSlideToggleModule, FormsModule, ReactiveFormsModule],
})
export class SwitchComponent {
  @Input() control: FormControl = new FormControl(false);
  @Input() label?: string;
}
