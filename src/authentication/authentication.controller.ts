import {
  Body,
  Controller,
  Inject,
  Param,
  Patch,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AccountEntity, OtpEmailCodeEntity } from './models';
import { AuthenticationService } from './authentication.service';
import {
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
  OtpCodeResponse,
} from './types';
import { HashProvider, LoginProvider, TokenProvider } from './providers';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailService } from '../email';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUseTags,
} from '@nestjs/swagger';
import { Account } from './account.decorator';

@Controller('auth')
@ApiUseTags('auth')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly tokenService: TokenProvider,
    @Inject(LoginProvider)
    private readonly loginProviders: LoginProvider[],
    @InjectRepository(OtpEmailCodeEntity)
    private readonly otpEmailRepository: Repository<OtpEmailCodeEntity>,
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    @Inject(EmailService)
    private readonly emailService: EmailService,
    private readonly hashProvider: HashProvider,
  ) {}

  @Post('login')
  @ApiOperation({ title: 'Login to System' })
  @ApiOkResponse({ description: 'User access token', type: LoginResponse })
  async login(@Body() credentials: LoginRequest): Promise<LoginResponse> {
    for (const provider of this.loginProviders) {
      if (provider.canHandle(credentials)) {
        const { account } = await provider.login(credentials);
        return await this.tokenService.generate(account);
      }
    }
    throw new UnauthorizedException();
  }

  @Post('otp/email/:email')
  @ApiOperation({ title: 'Request OtpEmail Code' })
  @ApiOkResponse({
    description: 'Id and expiration date of the created OtpEmailCodeEntity',
    type: OtpCodeResponse,
  })
  async generateOtpEmail(
    @Param('email') email: string,
  ): Promise<OtpCodeResponse> {
    const emailCode = new OtpEmailCodeEntity();
    emailCode.email = email;
    emailCode.generateCode();
    emailCode.expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    emailCode.retryLeft = 3;

    const { code, id, expiresAt } = await this.otpEmailRepository.save(
      emailCode,
    );

    /*
     * ToDo: Send an html content with full information and unsubscribe o ina
     */
    await this.emailService.send({
      to: email,
      subject: 'Login to Cepass',
      html: `You login code is ${code}`,
    });
    return { id, expiresAt };
  }

  @Patch('password')
  @ApiOperation({ title: 'Change current user Password' })
  @ApiOkResponse({ type: AccountEntity, description: 'Current user account' })
  @ApiBearerAuth()
  async updatePassword(
    @Account() account: AccountEntity,
    @Body() request: ChangePasswordRequest,
  ): Promise<AccountEntity> {
    if (
      account.password &&
      (await this.hashProvider.verify(
        request.currentPassword,
        account.password,
      ))
    ) {
      account.password = await this.hashProvider.hash(request.newPassword);
      account.shouldChangePassword = false;
      return await this.accountRepository.save(account);
    } else {
      throw new UnauthorizedException();
    }
  }
}
