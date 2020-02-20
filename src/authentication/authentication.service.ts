import { AccessTokenEntity, AccountEntity } from './models';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { LoginResponse } from './dto';

export class AuthenticationService {
  constructor(
    @InjectRepository(AccessTokenEntity)
    private readonly repository: Repository<AccessTokenEntity>,
  ) {}

  async login(account: AccountEntity): Promise<LoginResponse> {
    const token = new AccessTokenEntity();
    token.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 1000);
    token.account = account;
    const { id, expiresAt } = await this.repository.save(token);
    return { token: id, expiresAt };
  }

  async loginInTransaction(
    entityManager: EntityManager,
    account: AccountEntity,
  ): Promise<LoginResponse> {
    const token = new AccessTokenEntity();
    token.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 1000);
    token.account = account;
    const { id, expiresAt } = await entityManager.save(token);
    return { token: id, expiresAt };
  }

  async verifyToken(token: string): Promise<AccountEntity> {
    const accessToken = await this.repository.findOneOrFail(token, {
      relations: ['account'],
    });
    if (!accessToken || accessToken.isExpired()) {
      throw new UnauthorizedException();
    }
    return accessToken.account;
  }

  async logout(token: string): Promise<void> {
    const accessToken = await this.repository.findOne(token);
    if (!accessToken || accessToken.isExpired()) {
      return;
    }
    accessToken.isLoggedOut = true;
    await this.repository.save(accessToken);
  }
}
