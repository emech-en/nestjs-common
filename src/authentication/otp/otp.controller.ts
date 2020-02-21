import { Body, Controller, Inject, Optional, Post, UnauthorizedException } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity, OtpEntity } from '../models';
import { LoginResponse } from '../dto';
import { OtpLoginRequestDto } from './dto';
import { OnRegisterHandler, RegisterType } from '../handlers';
import { AuthenticationService } from '../authentication.service';

@Controller('auth/otp')
@ApiUseTags('auth/otp')
export class OtpController {
  constructor(
    @InjectRepository(OtpEntity)
    private readonly otpCodeRepository: Repository<OtpEntity>,
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    private readonly authenticationService: AuthenticationService,
    @Optional()
    @Inject(OnRegisterHandler)
    private readonly onRegisterHandler?: OnRegisterHandler,
  ) {}

  @Post('login')
  @ApiOperation({ title: 'Login to System Using One Time Password' })
  @ApiOkResponse({ description: 'User access token', type: LoginResponse })
  async login(@Body() { id, code }: OtpLoginRequestDto): Promise<LoginResponse> {
    const otpCode = await this.otpCodeRepository.findOne(id);

    if (!otpCode || otpCode.isExpired()) {
      throw new UnauthorizedException();
    } else if (otpCode.code !== code) {
      otpCode.retryLeft--;
      await this.otpCodeRepository.save(otpCode);
      throw new UnauthorizedException();
    }

    otpCode.usedAt = new Date();

    // Only one of the email or phone in otpCodeEntity object has value.
    const { email, phone } = otpCode;
    let account = await this.accountRepository.findOne(email ? { email } : { phone });
    let isNewAccount = false;

    if (!account) {
      isNewAccount = true;
      account = new AccountEntity();
      account.email = email;
      account.phone = phone;
    }

    return await this.otpCodeRepository.manager.transaction(async entityManager => {
      if (isNewAccount) {
        await entityManager.save(account);
        await this.onRegisterHandler?.handle(entityManager, account!, RegisterType.OTP);
      }
      await entityManager.save(otpCode);
      return await this.authenticationService.loginInTransaction(entityManager, account!);
    });
  }
}
