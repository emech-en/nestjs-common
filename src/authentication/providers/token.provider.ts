import { AccountEntity } from '../models';
import { LoginResponse } from '../types';

export abstract class TokenProvider {
  abstract async generate(account: AccountEntity): Promise<LoginResponse>;

  abstract async verify(token: string): Promise<AccountEntity>;
}
