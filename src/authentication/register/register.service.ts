import { UserBaseEntity } from '../models';

export enum RegisterType {
  OTP = 'OTP',
  PASSWORD = 'PASSWORD',
  XING = 'XING',
}

export abstract class RegisterService {
  abstract async register(
    userData: Partial<UserBaseEntity>,
    registerType: RegisterType,
    registerData?: any,
  ): Promise<UserBaseEntity>;
}
