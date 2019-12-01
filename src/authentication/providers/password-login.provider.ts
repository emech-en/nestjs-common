import { LoginProvider } from './login.provider';
import { LoginRequest, LoginResult, LoginType } from '../types';
import { AccountEntity } from '../models';
import { HashProvider } from './hash.provider';
import { UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

export class PasswordLoginProvider extends LoginProvider {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    private readonly hashProvider: HashProvider,
  ) {
    super();
  }

  canHandle(request: LoginRequest) {
    const isEmailPass = request.type === LoginType.EmailPass && !!request.password && !!request.email;
    const isUserPass = request.type === LoginType.UserPass && !!request.password && !!request.username;
    return !!isEmailPass || !!isUserPass;
  }

  async login(request: LoginRequest): Promise<LoginResult> {
    let account: AccountEntity | undefined;
    if (request.username) {
      account = await this.accountRepository.findOneOrFail({ username: request.username });
    }
    if (request.email) {
      account = await this.accountRepository.findOneOrFail({ email: request.email });
    }
    if (!account) {
      throw new UnauthorizedException();
    }

    if (await this.hashProvider.verify(request.password, account.password)) {
      return { account, isNew: false };
    } else {
      throw new UnauthorizedException();
    }
  }
}
