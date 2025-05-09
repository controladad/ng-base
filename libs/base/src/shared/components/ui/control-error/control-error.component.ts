import { Component, Input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { formControl } from '@al00x/forms';

@Component({
  selector: 'cac-control-error',
  standalone: true,
  imports: [AsyncPipe],
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
export class CacControlErrorComponent {
  @Input() control = formControl();
}
