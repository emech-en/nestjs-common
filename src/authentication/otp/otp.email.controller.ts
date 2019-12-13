import {
  Body,
  Controller,
  Inject,
  Optional,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity } from '../models';
import { OtpEntity, OtpType } from './models';
import { LoginResponse } from '../dto';
import { EmailService } from '../../email';
import {
  OptGenerateRequestDto,
  OptGenerateResponseDto,
  OtpLoginRequestDto,
} from './dto';
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
    @Inject(EmailService)
    private readonly emailService: EmailService,
    private readonly authenticationService: AuthenticationService,
    @Optional()
    @Inject(OnRegisterHandler)
    private readonly onRegisterHandler?: OnRegisterHandler,
  ) {}

  @Post('login')
  @ApiOperation({ title: 'Login to System Using One Time Password' })
  @ApiOkResponse({ description: 'User access token', type: LoginResponse })
  async login(
    @Body() { id, code }: OtpLoginRequestDto,
  ): Promise<LoginResponse> {
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
    let account = await this.accountRepository.findOne(
      email ? { email } : { phone },
    );
    let isNewAccount = false;

    if (!account) {
      isNewAccount = true;
      account = new AccountEntity();
      account.email = email;
      account.phone = phone;
    }

    return await this.otpCodeRepository.manager.transaction(
      async entityManager => {
        if (isNewAccount) {
          await entityManager.save(account);
          await this.onRegisterHandler?.handle(
            entityManager,
            RegisterType.OTP,
            account!,
          );
        }
        await entityManager.save(otpCode);
        return await this.authenticationService.loginInTransaction(
          entityManager,
          account!,
        );
      },
    );
  }

  @Post('request/:type/')
  @ApiOperation({ title: 'Request OTP Code' })
  @ApiOkResponse({
    description: 'Id and expiration date of the created OTP Code',
    type: OptGenerateResponseDto,
  })
  async generateOtp(
    @Body() { type, value }: OptGenerateRequestDto,
  ): Promise<OptGenerateResponseDto> {
    const emailCode = new OtpEntity();
    emailCode.generateCode();
    emailCode.expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    emailCode.retryLeft = 3;
    emailCode.type = type;
    switch (type) {
      case OtpType.EMAIL:
        emailCode.email = value;
        break;
      case OtpType.SMS:
        emailCode.phone = value;
        break;
    }

    const { code, id, expiresAt } = await this.otpCodeRepository.save(
      emailCode,
    );

    /*
     * ToDo: Send an html content with full information and unsubscribe o ina
     */
    await this.emailService.send({
      to: value,
      subject: 'Login',
      html: `You login code is ${code}`,
    });
    return { id, expiresAt };
  }
}
