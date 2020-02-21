import { Inject, Injectable, Optional, UnauthorizedException } from '@nestjs/common';
import { XING_SIGNATURE_SALT } from './xing.helpers';
import { LoginResponse } from '../dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { AccountEntity } from '../models';
import { AuthenticationService } from '../authentication.service';
import { OnRegisterHandler, RegisterType } from '../handlers';
import { createHmac } from 'crypto';

@Injectable()
export class XingService {
  constructor(
    @Inject(XING_SIGNATURE_SALT)
    private readonly xingSignatureSalt: string,
    @Inject(AuthenticationService)
    private readonly authenticationService: AuthenticationService,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    @Optional()
    @Inject(OnRegisterHandler)
    private readonly onRegisterHandler?: OnRegisterHandler,
  ) {}

  async validateLogin(user: any, xingHash: string) {
    if (!user.active_email) {
      throw new UnauthorizedException();
    }
    const hash = await this.generateUserDtoHash(user);
    if (hash !== xingHash) {
      throw new UnauthorizedException();
    }
  }

  async loginByXing(userDto: any): Promise<LoginResponse> {
    return await this.entityManager.transaction(async entityManager => {
      const accountRepo = entityManager.getRepository(AccountEntity);

      let account = await accountRepo.findOne({ email: userDto.active_email });
      if (!account) {
        account = new AccountEntity();
        account.email = userDto.active_email;
        await entityManager.save(account);
        await this.onRegisterHandler?.handle(entityManager, account, RegisterType.XING, userDto);
      }

      return this.authenticationService.loginInTransaction(entityManager, account);
    });
  }

  private async generateUserDtoHash(userDto: any): Promise<string> {
    try {
      const userDtoArrays = await this.generateArrayList(userDto);
      const sortedArray = userDtoArrays.sort();
      const userDtoString = sortedArray.join('');

      const hmac = createHmac('SHA256', this.xingSignatureSalt);
      hmac.update(userDtoString);
      return hmac.digest('hex');
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  private async generateArrayList(user: any): Promise<string[]> {
    const keys = Object.keys(user);
    const arrays: string[] = [];

    for (const key of keys) {
      await new Promise(resolve => setImmediate(resolve));
      if (typeof user[key] === 'object') {
        const innerArray = await this.generateArrayList(user[key]);
        arrays.push(...innerArray.map(s => key + s));
      } else {
        arrays.push(key + user[key]);
      }
    }

    return arrays;
  }
}
