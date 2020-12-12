import { version as appVersion } from '../../package.json';
import { Provider } from '@nestjs/common';

export const APP_INFO = 'APP_INFO';
export interface AppInfo {
  startTime: number;
  version: string;
  upTime: string;
}

export const appInfo: AppInfo = {
  startTime: Date.now(),
  version: appVersion,
  upTime: '0',
};

export const AppInfoProvider: Provider = {
  provide: APP_INFO,
  useValue: appInfo,
};
