import { Injectable } from '@angular/core';
import { AuthEntity, LoginModel } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  login(model: LoginModel) {
    return http$.post<AuthEntity>(`/User/Login`, model);
  }

  me() {
    return http$.get<AuthEntity>(`/me`);
  }
}
