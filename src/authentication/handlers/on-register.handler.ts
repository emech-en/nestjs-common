import { EntityManager } from 'typeorm';
import { AccountEntity } from '../models';

export enum RegisterType {
  OTP = 'OTP',
  PASSWORD = 'PASSWORD',
  XING = 'XING',
}

export abstract class OnRegisterHandler {
  abstract async handle(
    entityManager: EntityManager,
    account: AccountEntity,
    registerType: RegisterType,
    registerData?: any,
  ): Promise<void>;
}
