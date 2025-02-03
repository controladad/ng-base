import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  signal,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { ButtonClickEvent, CacButtonComponent } from '../../ui';
import { ActionTypes } from '../../../../core';
import { MatTooltipModule } from '@angular/material/tooltip';

// TODO: Fix Permissions & Role

@Component({
  selector: 'cac-bottom-controls',
  standalone: true,
  imports: [CacButtonComponent, MatTooltipModule],
  templateUrl: './bottom-controls.component.html',
  styleUrls: ['./bottom-controls.component.scss'],
})
export class CacBottomControlsComponent implements OnInit, OnChanges {
  @ViewChild('SubmitButton') submitButton!: CacButtonComponent;

  @Input() cancelText? = $localize`:@@base.ui.field.cancel:Cancel`
  @Input() submitText = $localize`:@@base.ui.field.apply:Save`;
  @Input() submitClass?: string;
  @Input() cancelClass?: string;
  @Input() cancelRoute?: string[];
  @Input() hideCancel = false;
  @Input() form?: AbstractControl;
  @Input() disabled = false;
  @Input() actionType?: ActionTypes | undefined;

  @Output() onCancel = new EventEmitter();
  @Output() onError = new EventEmitter();
  @Output() onSubmit = new EventEmitter<ButtonClickEvent>();

  insufficientPermission = signal(false);
  INSUFFICIENT_PERMISSION_TEXT = $localize`:@@base.feature.dialog.insufficientPermission:You do not have permission to perform this action.`;

  ngOnInit(): void {
    this.setPermissionState();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['actionType']) {
      this.setPermissionState();
    }
  }

  protected onSubmitClick(e: ButtonClickEvent) {
    if (this.disabled || this.insufficientPermission()) return;

    this.submit(e);
  }

  protected onCancelClick() {
    this.cancel();
  }

  submit(e?: ButtonClickEvent) {
    if (this.insufficientPermission() || this.disabled) {
      return;
    }

    const buttonEvent = e ?? this.submitButton.createClickEvent(undefined);
    if (this.form) {
      this.form.markAllAsTouched();
      if (this.form.valid) {
        this.onSubmit.emit(buttonEvent);
      } else {
        this.onError.emit();
      }
    } else {
      this.onSubmit.emit(buttonEvent);
    }
  }

  cancel() {
    this.onCancel.emit();
  }

  private setPermissionState() {
    // this.insufficientPermission.set(this.actionType ? !this.roleService.hasActionPermission(this.actionType) : false);
  }
}
