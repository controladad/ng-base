import { Component, Input, OnInit } from '@angular/core';
import { formBuilder, FormBuilderComponent } from '../form-builder';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonClickEvent, ButtonComponent } from '../../ui';
import { AuthStore, AuthStoreLoginModel, formControl } from '../../../../core';
import { Observable } from 'rxjs';

interface LoginFormGroup {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginFormOptions {
  loginFn?: (model: AuthStoreLoginModel) => Observable<any>;
  hideRememberMe?: boolean;
}

@Component({
  selector: 'feature-login-form',
  standalone: true,
  imports: [FormBuilderComponent, ButtonComponent],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
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
        label: 'نام کاربری',
        class: 'unicode-normal',
        suffixIcon: 'user',
      },
      password: {
        control: formControl('', Validators.required),
        class: 'unicode-normal',
        label: 'رمز عبور',
        inputType: 'password',
        suffixIcon: 'password',
      },
      rememberMe: {
        control: formControl(false),
        label: 'مرا به خاطر بسپار',
        type: 'checkbox',
        class: '-mt-2',
      },
    },
  });

  constructor(
    private authStore: AuthStore,
    private router: Router,
  ) {}

  ngOnInit() {
    if (this.options.hideRememberMe) {
      this.formBuilder.hide('rememberMe');
    }
  }

  login(e: ButtonClickEvent) {
    if (!this.formBuilder.validate()) return;

    const model = {
      username: this.formBuilder.inputs.username.control.value,
      password: this.formBuilder.inputs.password.control.value,
      rememberMe: this.formBuilder.inputs.rememberMe.control.value,
    };

    (this.options.loginFn ? this.options.loginFn(model) : this.authStore.login(model)).pipe(e.pipe()).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
    });
  }
}
