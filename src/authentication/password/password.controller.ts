import {
  BadRequestException,
  Body,
  Controller,
  Patch,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUseTags,
} from '@nestjs/swagger';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity } from '../models';
import { LoginResponse } from '../dto';
import { PasswordChangeRequestDto, PasswordLoginRequestDto } from './dto';
import { Account } from '../decorators';
import { PasswordService } from './password.service';
import { AuthenticationService } from '../authentication.service';

@Controller('auth/password')
@ApiUseTags('auth/password')
export class PasswordController {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    private readonly authenticationService: AuthenticationService,
    private readonly passwordService: PasswordService,
  ) {}

  @Post('login')
  @ApiOperation({ title: 'Login to System Using One Time Password' })
  @ApiOkResponse({ description: 'User access token', type: LoginResponse })
  async login(@Body() req: PasswordLoginRequestDto): Promise<LoginResponse> {
    const { username, email, password } = req;
    if ((!username && !email) || !password) {
      throw new BadRequestException();
    }

    const account = await this.accountRepository.findOne(
      email ? { email } : { username },
    );

    if (!account || !account.password) {
      throw new UnauthorizedException();
    }

    if (await this.passwordService.verify(password, account.password)) {
      return this.authenticationService.login(account);
    } else {
      throw new UnauthorizedException();
    }
  }

  @Patch('/')
  @ApiBearerAuth()
  @ApiOperation({ title: 'Change current user Password' })
  @ApiOkResponse({ description: 'Password Changed Successfully.' })
  async updatePassword(
    @Account() account: AccountEntity,
    @Body() request: PasswordChangeRequestDto,
  ): Promise<void> {
    if (!account.password) {
      throw new UnauthorizedException();
    }

    const { currentPassword, newPassword } = request;
    if (await this.passwordService.verify(currentPassword, account.password)) {
      account.password = await this.passwordService.hash(newPassword);
      account.shouldChangePassword = false;
      await this.accountRepository.save(account);
    } else {
      throw new UnauthorizedException();
    }
  }

  @Post('/')
  @ApiBearerAuth()
  @ApiOperation({ title: 'Set current user password' })
  @ApiOkResponse({ description: 'Password Set Successfully.' })
  async setPassword(
    @Account() account: AccountEntity,
    @Body('password') password: string,
  ): Promise<void> {
    if (account.password) {
      throw new UnauthorizedException();
    }

    account.password = await this.passwordService.hash(password);
    account.shouldChangePassword = false;
    await this.accountRepository.save(account);
  }
}
