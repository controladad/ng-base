import { Component, Input } from '@angular/core';
import { formControl } from '../../../../core';
import { AsyncPipe, NgIf } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'ui-control-error',
  standalone: true,
  imports: [NgIf, AsyncPipe],
  templateUrl: './control-error.component.html',
  styleUrls: ['./control-error.component.scss'],
  animations: [
    trigger('errorAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-5px)' }),
        animate('300ms cubic-bezier(0.55, 0, 0.55, 0.2)', style({ opacity: 1, transform: 'translateY(0px)' })),
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translateY(0px)' }),
        animate('300ms cubic-bezier(0.55, 0, 0.55, 0.2)', style({ opacity: 0, transform: 'translateY(-5px)' })),
      ]),
    ]),
  ],
})
export class ControlErrorComponent {
  @Input() control = formControl();
}
