import { AccessTokenEntity, UserBaseEntity } from './models';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginResponse } from './dto';
import { RequestTransaction } from '../request-transaction';
import { RegisterService, RegisterType } from './register';

@Injectable()
export class AuthenticationService {
  constructor(private readonly reqTransaction: RequestTransaction, private readonly registerService: RegisterService) {}

  async register(
    userData: Partial<UserBaseEntity>,
    registerType: RegisterType,
    registerData?: any,
  ): Promise<UserBaseEntity> {
    return this.registerService.register(userData, registerType, registerData);
  }

  async login(user: UserBaseEntity): Promise<LoginResponse> {
    const repository = this.reqTransaction.getRepository(AccessTokenEntity);

    const token = new AccessTokenEntity();
    token.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    token.user = user;
    const { id, expiresAt } = await repository.save(token);
    return { token: id, expiresAt };
  }

  async verifyToken(token: string): Promise<UserBaseEntity> {
    const repository = this.reqTransaction.getRepository(AccessTokenEntity);
    const accessToken = await repository.findOneOrFail(token, {
      relations: ['user'],
    });
    if (!accessToken || accessToken.isExpired()) {
      throw new UnauthorizedException();
    }
    return accessToken.user;
  }

  async logout(token: string): Promise<void> {
    const repository = this.reqTransaction.getRepository(AccessTokenEntity);
    const accessToken = await repository.findOne(token);
    if (!accessToken || accessToken.isExpired()) {
      return;
    }
    accessToken.isLoggedOut = true;
    await repository.save(accessToken);
  }
}
