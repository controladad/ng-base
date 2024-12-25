import { Injectable } from '@angular/core';
import { SettingEntity, SettingUpdate } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class SettingApiService {
  get() {
    return http$.get<SettingEntity>('/settings');
  }

  update(model: SettingUpdate) {
    return http$.post('/settings', model);
  }
}
