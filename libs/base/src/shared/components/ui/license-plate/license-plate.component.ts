import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  signal,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AsyncPipe, NgForOf, NgIf, NgTemplateOutlet } from '@angular/common';
import { formControl, FormControlExtended } from '../../../../core';
import { ControlErrorComponent } from '../control-error';
import { MatInputModule } from '@angular/material/input';
import { createMask, InputMaskDirective, NgLetDirective } from '../../../directives';

@Component({
  selector: 'ui-license-plate',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    InputMaskDirective,
    NgIf,
    AsyncPipe,
    ControlErrorComponent,
    NgTemplateOutlet,
    MatInputModule,
    NgLetDirective,
  ],
  templateUrl: './license-plate.component.html',
  styleUrls: ['./license-plate.component.scss'],
})
export class LicensePlateComponent implements OnChanges, OnDestroy, OnInit {
  @ViewChild('input') inputEl?: ElementRef<HTMLInputElement>;
  @Input() control: FormControlExtended = formControl<string | undefined>(undefined);
  @Input() label?: string;
  @Input() hideError = false;
  @Input() mini = false;
  @Input() readonly = false;

  @Input() value?: string;

  inputMask = createMask({
    definitions: {
      D: {
        validator:
          // '\u0628|\u062c|\u062F|\u0633|\u0635|\u0698|\u0642|\u0637|\u0644|\u0645|\u0646|\u0647|\u0648|\u0649|\u06BE|\u06CC|\u0639',
          '[\u0600-\u06FF]',
      },
      '0': {
        validator: '\\d|[\u06F0-\u06F9]',
      },
    },
    mask: '00 D 000 00',
    placeholder: '__ _ ___ __',
    skipOptionalPartCharacter: ' ',
    parser: (v: string) => v.replace(/ /g, ''),
  });
  firstSection?: string;
  letterSection?: string;
  secondSection?: string;
  stateSection?: string;
  sub = new Subscription();
  isFocused = signal(false);

  ngOnInit(): void {
    if (this.value) {
      this.control.patchValue(this.value);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['control'] || changes['value']) {
      this.sub?.unsubscribe();
      this.sub = this.control.valueChanges.subscribe(() => {
        this.parsePlateSections();
      });
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onFocusChanged(focus: boolean) {
    this.isFocused.set(focus);
  }

  onInputChange() {
    this.updateInputActualValue();
  }

  private parsePlateSections() {
    const value = this.inputEl?.nativeElement?.value ?? '';
    const split = value.split(' ');
    this.firstSection = split.length > 0 ? split[0] : '';
    this.letterSection = split.length > 1 ? split[1] : '';
    this.secondSection = split.length > 2 ? split[2] : '';
    this.stateSection = split.length > 3 ? split[3] : '';
  }

  private updateInputActualValue() {
    if (!this.inputEl?.nativeElement) return;
    const value = this.inputEl.nativeElement.value ?? '';
    const placeholder = this.inputMask.placeholder ?? '';
    (this.inputEl.nativeElement as any).actualValue = this.extractValueFromMask(value, placeholder);
  }

  private extractValueFromMask(maskedValue: string, placeholder: string) {
    let result = '';
    for (let i = 0; i < maskedValue.length; i++) {
      if (maskedValue.at(i) !== placeholder.at(i)) {
        result += maskedValue.at(i);
      }
    }
    return result;
  }
}
