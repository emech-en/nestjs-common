import { SimpleUserEntity } from '../models';

export enum RegisterType {
  OTP = 'OTP',
  PASSWORD = 'PASSWORD',
  XING = 'XING',
}

export abstract class RegisterService {
  abstract async register(
    account: Partial<SimpleUserEntity>,
    registerType: RegisterType,
    registerData?: any,
  ): Promise<SimpleUserEntity>;
}
