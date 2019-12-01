import { LoginRequest, LoginResult } from '../types';
import { Provider, Type } from '@nestjs/common';

export abstract class LoginProvider {
  abstract async login(credential: LoginRequest): Promise<LoginResult>;

  abstract canHandle(credential: LoginRequest): boolean;
}

export function setLoginProviders(...classes: Array<Type<LoginProvider>>): Provider {
  return {
    provide: LoginProvider,
    useFactory: (...args) => [...args],
    inject: [...classes],
  };
}
