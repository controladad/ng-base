import { Component, Input } from '@angular/core';
import { CacButtonComponent } from '../button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'cac-loader-screen',
  standalone: true,
  imports: [CacButtonComponent, MatProgressSpinnerModule],
  templateUrl: './loader-screen.component.html',
  styleUrls: ['./loader-screen.component.scss'],
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 1 }),
        // animate()
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('750ms cubic-bezier(.26,.86,.22,1.02)', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class CacLoaderScreenComponent {
  @Input() show = false;
  @Input() errored = false;
  @Input() hideSpinner = false;
  @Input() blurry = false;
  @Input() z = 49;

  onRetry() {
    location.reload();
  }
}
