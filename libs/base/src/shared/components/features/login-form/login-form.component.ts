import { Component, inject, Input, OnInit } from '@angular/core';
import { formBuilder, CacFormBuilderComponent } from '../form-builder';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonClickEvent, CacButtonComponent } from '../../ui';
import { formControl } from '../../../forms';
import { CacBase } from '../../../../configs';

interface LoginFormGroup {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginFormOptions {
  hideRememberMe?: boolean;
  // give null or false to disable navigation
  routeTo?: string | null | false;
  beforeLoginAction?: () => void;
  afterLoginAction?: () => void;
}

@Component({
  selector: 'cac-login-form',
  standalone: true,
  imports: [CacFormBuilderComponent, CacButtonComponent],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class CacLoginFormComponent implements OnInit {
  private readonly auth = inject(CacBase.config.states.auth);
  private readonly router = inject(Router);

  @Input() options: LoginFormOptions = {};

  formBuilder = formBuilder<LoginFormGroup>({
    cols: 1,
    allowAutocomplete: true,
    defaults: {
      appearance: 'simple',
    },
    inputs: {
      username: {
        control: formControl('', Validators.required),
        label: $localize`:@@base.feature.login.username:Username`,
        class: 'unicode-normal',
        suffixIcon: 'user',
      },
      password: {
        control: formControl('', Validators.required),
        class: 'unicode-normal',
        label: $localize`:@@base.feature.login.password:Password`,
        inputType: 'password',
        suffixIcon: 'password',
      },
      rememberMe: {
        control: formControl(false),
        label: $localize`:@@base.feature.login.rememberMe:Remember Me`,
        type: 'checkbox',
        class: '-mt-2',
      },
    },
  });

  ngOnInit() {
    if (this.options.hideRememberMe) {
      this.formBuilder.hide('rememberMe');
    }
  }

  login(e: ButtonClickEvent) {
    const model = {
      username: this.formBuilder.inputs.username.control.value,
      password: this.formBuilder.inputs.password.control.value,
      rememberMe: this.formBuilder.inputs.rememberMe.control.value,
    };

    this.options?.beforeLoginAction?.();
    this.auth.login(model).pipe(e.pipe()).subscribe({
      next: () => {
        if (this.options.routeTo !== false && this.options.routeTo !== null) {
          this.router.navigate([this.options.routeTo ?? '/']);
        }
        this.options?.afterLoginAction?.();
      },
    });
  }
}
