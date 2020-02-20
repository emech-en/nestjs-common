import {
  BadRequestException,
  Body,
  Controller,
  Head,
  Inject,
  Optional,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUseTags,
} from '@nestjs/swagger';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity } from '../models';
import { LoginResponse } from '../dto';
import { AuthenticationService } from '../authentication.service';
import { PasswordRegisterRequestDto } from './dto';
import { PasswordService } from './password.service';
import { OnRegisterHandler, RegisterType } from '../handlers';

@Controller('auth/password')
@ApiUseTags('auth/password')
export class PasswordRegisterController {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepo: Repository<AccountEntity>,
    private readonly authenticationService: AuthenticationService,
    private readonly passwordService: PasswordService,
    @Optional()
    @Inject(OnRegisterHandler)
    private readonly onRegisterHandler?: OnRegisterHandler,
  ) {}

  @Head('username/:username')
  @ApiOkResponse({ description: 'Username is valid.' })
  @ApiBadRequestResponse({ description: 'Username is invalid.' })
  async checkUsername(@Param('username') username: string): Promise<void> {
    if (!username) {
      throw new BadRequestException();
    }
    const isDuplicateUser = (await this.accountRepo.count({ username })) > 0;
    if (isDuplicateUser) {
      throw new BadRequestException();
    }
  }

  @Head('email/:email')
  @ApiOkResponse({ description: 'Email is valid.' })
  @ApiBadRequestResponse({ description: 'Email is invalid.' })
  async checkEmail(@Param('email') email: string): Promise<void> {
    if (!email) {
      throw new BadRequestException();
    }
    const isDuplicateUser = (await this.accountRepo.count({ email })) > 0;
    if (isDuplicateUser) {
      throw new BadRequestException();
    }
  }

  @Head('password/:password')
  @ApiOkResponse({ description: 'Password is valid.' })
  @ApiBadRequestResponse({ description: 'Password is invalid.' })
  async checkPassword(@Param('password') password: string): Promise<void> {
    if (!password) {
      throw new BadRequestException();
    }
  }

  @Post('register')
  @ApiOperation({ title: 'Register new user' })
  @ApiOkResponse({ description: 'User access token', type: LoginResponse })
  async login(@Body() req: PasswordRegisterRequestDto): Promise<LoginResponse> {
    const { username, email, password } = req;
    if ((!username && !email) || !password) {
      throw new BadRequestException();
    }

    if (username) {
      await this.checkUsername(username);
    }
    if (email) {
      await this.checkEmail(email);
    }

    const account = new AccountEntity();
    account.email = email;
    account.username = username;
    account.password = await this.passwordService.hash(password);
    return await this.accountRepo.manager.transaction(async entityManager => {
      await entityManager.save(account);
      await this.onRegisterHandler?.handle(
        entityManager,
        RegisterType.PASSWORD,
        account,
      );
      return this.authenticationService.loginInTransaction(
        entityManager,
        account,
      );
    });
  }
}
