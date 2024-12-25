export interface SettingEntity {
  serverIP: string;
}

export type SettingUpdate = Partial<SettingEntity>;
