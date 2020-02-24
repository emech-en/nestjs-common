import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { XING_SIGNATURE_SALT } from './xing.helpers';
import { LoginResponse } from '../dto';
import { UserBaseEntity } from '../models';
import { AuthenticationService } from '../authentication.service';
import { RegisterType } from '../register';
import { createHmac } from 'crypto';
import { RequestTransaction } from '../../request-transaction';

@Injectable()
export class XingService {
  constructor(
    @Inject(XING_SIGNATURE_SALT)
    private readonly xingSignatureSalt: string,
    private readonly authenticationService: AuthenticationService,
    private readonly requestTransaction: RequestTransaction,
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

  async loginByXing(userDto: any, hash: string): Promise<LoginResponse> {
    await this.validateLogin(userDto, hash);
    const userRepo = this.requestTransaction.getRepository(UserBaseEntity);

    let user = await userRepo.findOne({ email: userDto.active_email });
    if (!user) {
      const userData = { email: userDto.active_email };
      user = await this.authenticationService.register(userData, RegisterType.XING, userDto);
    }

    return this.authenticationService.login(user);
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
