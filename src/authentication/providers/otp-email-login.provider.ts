import { LoginProvider } from './login.provider';
import {
  AccountRegisterData,
  LoginRequest,
  LoginResult,
  LoginType,
  RegisterType,
} from '../types';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AccountEntity, OtpEmailCodeEntity } from '../models';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class OtpEmailLoginProvider extends LoginProvider {
  constructor(
    @InjectRepository(OtpEmailCodeEntity)
    private readonly emailCodeRepository: Repository<OtpEmailCodeEntity>,
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {
    super();
  }

  canHandle(request: LoginRequest) {
    return request.type === LoginType.OtpEmail;
  }

  async login(request: LoginRequest): Promise<LoginResult> {
    if (!request.id || !request.code) {
      throw new BadRequestException('{id} and {code} is Required');
    }

    const emailCode = await this.emailCodeRepository.findOneOrFail(request.id);
    if (emailCode.isExpired()) {
      throw new UnauthorizedException();
    } else if (emailCode.code !== request.code) {
      emailCode.retryLeft--;
      await this.emailCodeRepository.save(emailCode);
      throw new UnauthorizedException();
    }

    emailCode.usedAt = new Date();
    await this.emailCodeRepository.save(emailCode);

    const { email } = emailCode;
    let account = await this.accountRepository.findOne({ email });
    let isNew = false;

    if (!account) {
      isNew = true;
      account = new AccountEntity();
      account.email = email;
      await this.accountRepository.save(account, {
        data: {
          registerType: RegisterType.OtpEmail,
        } as AccountRegisterData,
      });
    }

    return { account, isNew };
  }
}
