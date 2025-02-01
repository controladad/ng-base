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

import { ButtonClickEvent, ButtonComponent } from '../../ui';
import { ActionTypes } from '../../../../core';
import { MatTooltipModule } from '@angular/material/tooltip';

// TODO: Fix Permissions & Role

@Component({
  selector: 'feature-bottom-controls',
  standalone: true,
  imports: [ButtonComponent, MatTooltipModule],
  templateUrl: './bottom-controls.component.html',
  styleUrls: ['./bottom-controls.component.scss'],
})
export class BottomControlsComponent implements OnInit, OnChanges {
  @ViewChild('SubmitButton') submitButton!: ButtonComponent;

  @Input() cancelText?: string = 'Cancel';
  @Input() submitText = 'Save';
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
