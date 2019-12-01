import { AccountEntity } from '../models';
import { RegisterType } from './register.type.enum';

export interface RegisterRequest {
  email?: string;
  username?: string;
  domainData?: any;
}

export interface LoginResult {
  account: AccountEntity;
  isNew: boolean;
}

export interface AccountRegisterData {
  registerType: RegisterType;
}
