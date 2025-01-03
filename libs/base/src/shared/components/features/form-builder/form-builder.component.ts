import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  runInInjectionContext,
  signal,
  ViewChild,
} from '@angular/core';
import { Observable, of, Subscription, map } from 'rxjs';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilderInputItem, FormBuilderInputOption } from './form-builder.types';
import { FormBuilder } from './form-builder';
import { ScreenDetectorService } from '@al00x/screen-detector';
import { NgLetDirective } from '../../../directives';
import { ControlBuilderComponent } from './control-builder.component';

@Component({
  selector: 'feature-form-builder',
  standalone: true,
  imports: [
    AsyncPipe,
    NgForOf,
    NgIf,
    NgLetDirective,
    ControlBuilderComponent,
  ],
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss'],
})
export class FormBuilderComponent<T, U = T> implements OnInit, AfterViewInit, OnDestroy {
  injector = inject(Injector);
  screenDetector = inject(ScreenDetectorService);

  @ViewChild('Wrapper') wrapperEl!: ElementRef<HTMLDivElement>;
  @ViewChild('TabIndexEntry') tabIndexEntryEl!: ElementRef<HTMLInputElement>;

  @Input('options') _options!: FormBuilder<T, U>;
  @Input() focusOnInit = false;

  protected inputItems = signal<FormBuilderInputItem<T>[]>([]);
  private subs = new Subscription();

  ngOnInit() {
    this.updateInputs();
  }

  ngAfterViewInit() {
    if (this.focusOnInit) {
      setTimeout(() => {
        this.focusTabIndexEntry();
      }, 5);
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  getValues() {
    return this._options.getValue();
  }

  reset() {
    return this._options.reset();
  }

  focus() {
    const firstInput = this.wrapperEl.nativeElement.querySelector('input');
    if (firstInput) {
      firstInput.focus();
    }
  }

  focusTabIndexEntry() {
    this.tabIndexEntryEl.nativeElement.focus();
  }

  scrollToErrored() {
    const index = Object.values(this._options.formGroup.controls).findIndex((t) => t.invalid);
    if (index === -1) return;
    // we add it by one because there's an extra absolute element at the top of the tree
    this.wrapperEl.nativeElement.children.item(index + 1)?.scrollIntoView({
      behavior: 'smooth',
    });
  }

  // reinit() {
  //   this.formGroup.reset();
  //   this.formGroup = new UntypedFormGroup({});
  //   this.subs.unsubscribe();
  //   this.subs = new Subscription();
  //   this.updateInputs();
  // }

  private updateInputs() {
    runInInjectionContext(this.injector, () => {
      this.bindToSub(this._options.invokeInit());

      const inputOptions: FormBuilderInputOption<T>[] = Object.values(this._options.inputs);

      const items: FormBuilderInputItem<T>[] = [];
      for (let i = 0; i < this._options.keys.length; i++) {
        const key = this._options.keys[i];

        const rawOption = inputOptions[i];
        const colspan = rawOption.colspan !== undefined ? rawOption.colspan : this._options.defaults!.colspan!;
        const option: FormBuilderInputItem<T> = {
          ...rawOption,
          key: key,
          appearance: rawOption.appearance ?? this._options.defaults!.appearance!,
          clearable: rawOption.clearable !== undefined ? rawOption.clearable : this._options.defaults!.clearable!,
          colspan: colspan,
          hideError: rawOption.hideError !== undefined ? rawOption.hideError : this._options.defaults!.hideError!,
          floatLabel: rawOption.floatLabel !== undefined ? rawOption.floatLabel : this._options.defaults?.floatLabel,
          class$Value: toSignal(rawOption.class$ ?? of(rawOption.class)),
          hidden$Value: toSignal(rawOption.hidden$ ?? of(false)),
          styles$Value: toSignal(
            this.screenDetector.state$.pipe(
              map((state) => ({ gridColumn: state.md ? `span ${colspan} / span ${colspan}` : 1 })),
            ),
          ),
        };

        if (option.disabled$) {
          this.subs.add(
            option.disabled$.subscribe((value) => {
              if (value) {
                option.control.disable();
              } else {
                option.control.enable();
              }
            }),
          );
        }

        items.push(option);
      }

      this.inputItems.set(items);

      this.bindToSub(this._options.invokeAfterInit());
    });
  }

  private bindToSub(result: void | Subscription | Observable<any>) {
    if (result instanceof Subscription) {
      this.subs.add(result);
    } else if (result instanceof Observable) {
      this.subs.add(result.subscribe());
    }
  }

  trackBy = (index: number, item: FormBuilderInputItem<any>) => item.key;
}
