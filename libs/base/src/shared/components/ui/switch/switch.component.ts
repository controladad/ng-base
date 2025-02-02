import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'cac-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatSlideToggleModule, FormsModule, ReactiveFormsModule],
})
export class CacSwitchComponent {
  @Input() control: FormControl = new FormControl(false);
  @Input() label?: string;
}
