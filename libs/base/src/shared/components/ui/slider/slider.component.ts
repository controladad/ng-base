import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';

export interface RangeFormGroup {
  start: FormControl<number | null>;
  end: FormControl<number | null>;
}

@Component({
  selector: 'cac-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  imports: [MatSliderModule, ReactiveFormsModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CacSliderComponent {
  @Input() type: 'basic' | 'range' = 'basic';
  @Input() control: FormControl = new FormControl();
  @Input() formGroup: FormGroup<RangeFormGroup> = new FormGroup({ start: new FormControl(), end: new FormControl() });
  @Input({ required: true }) min = 0;
  @Input({ required: true }) max = 100;
  @Input() steps = 1;
  @Input() hasLabel = true;
  @Input() isDisabled = false;
  @Input() isDoted = false;
  @Input() label?: string;
}
