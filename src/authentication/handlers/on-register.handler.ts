import { EntityManager } from 'typeorm';
import { AccountEntity } from '../models';

export enum RegisterType {
  OTP = 'OTP',
  PASSWORD = 'PASSWORD',
}

export abstract class OnRegisterHandler {
  abstract async handle(
    entityManager: EntityManager,
    registerType: RegisterType,
    account: AccountEntity,
  ): Promise<void>;
}
