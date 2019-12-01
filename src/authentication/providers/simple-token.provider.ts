import { TokenProvider } from './token.provider';
import { AccessTokenEntity, AccountEntity } from '../models';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { LoginResponse } from '../types';

export class SimpleTokenProvider extends TokenProvider {
  constructor(
    @InjectRepository(AccessTokenEntity)
    private readonly repository: Repository<AccessTokenEntity>,
  ) {
    super();
  }

  async generate(account: AccountEntity): Promise<LoginResponse> {
    const token = new AccessTokenEntity();
    token.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 1000);
    token.account = account;
    const { id, expiresAt } = await this.repository.save(token);
    return { token: id, expiresAt };
  }

  async verify(token: string): Promise<AccountEntity> {
    const accessToken = await this.repository.findOneOrFail(token, { relations: ['account'] });
    if (!accessToken || accessToken.isExpired()) {
      throw new UnauthorizedException();
    }
    return accessToken.account;
  }
}
