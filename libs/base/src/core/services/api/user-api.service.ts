import { Injectable } from '@angular/core';
import { ChangePassword, UserCreate, UserEntity, UserUpdate } from '../../models';
import { BaseApi } from './_base-api';
import { getFullName } from '../../helpers';

@Injectable({
  providedIn: 'root',
})
export class UserApiService extends BaseApi<UserEntity, UserCreate, UserUpdate> {
  constructor() {
    super('/User');
  }

  changePassword(model: ChangePassword) {
    return http$.post('/User/ChangePassword', model);
  }

  getItems() {
    return super.getItemRecords((t) => getFullName(t));
  }
}
