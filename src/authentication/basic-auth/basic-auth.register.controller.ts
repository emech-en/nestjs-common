import { BadRequestException, Body, Controller, Head, Inject, Param, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserBaseEntity } from '../models';
import { LoginResponse } from '../dto';
import { AuthenticationService } from '../authentication.service';
import { BasicAuthRegisterRequestDto } from './dto';
import { BasicAuthService } from './basic-auth.service';
import { RequestTransaction } from '../../request-transaction';
import { RegisterType } from '../register';
import { BasicAuthOptions, BASIC_AUTH_OPTIONS } from './basic-auth.options';
import isEmail from 'validator/lib/isEmail';

@Controller('auth/basic')
@ApiTags('Authentication')
export class BasicAuthRegisterController {
  constructor(
    private readonly requestTransaction: RequestTransaction,
    private readonly authenticationService: AuthenticationService,
    private readonly basicAuthService: BasicAuthService,
    @Inject(BASIC_AUTH_OPTIONS)
    private readonly options: BasicAuthOptions,
  ) {}

  @Head('username/:username')
  @ApiOperation({ summary: 'Check Username is Valid or Available' })
  @ApiOkResponse({ description: 'Username is valid.' })
  @ApiBadRequestResponse({ description: 'Username is invalid.' })
  async checkUsername(@Param('username') username: string): Promise<void> {
    if (!username || !this.options.username?.register?.required) {
      throw new BadRequestException();
    }
    const userRepo = this.requestTransaction.getRepository(UserBaseEntity);
    const isDuplicateUser = (await userRepo.count({ username })) > 0;
    if (isDuplicateUser) {
      throw new BadRequestException();
    }
  }

  @Head('email/:email')
  @ApiOperation({ summary: 'Check if Email is Valid or Available' })
  @ApiOkResponse({ description: 'Email is valid.' })
  @ApiBadRequestResponse({ description: 'Email is invalid.' })
  async checkEmail(@Param('email') email: string): Promise<void> {
    if (!email || !this.options.email?.register) {
      throw new BadRequestException();
    } else if (!isEmail(email)) {
      throw new BadRequestException();
    }
    const userRepo = this.requestTransaction.getRepository(UserBaseEntity);
    const isDuplicateUser = (await userRepo.count({ email })) > 0;
    if (isDuplicateUser) {
      throw new BadRequestException();
    }
  }

  @Head('password/:password')
  @ApiOperation({ summary: 'Check if Password is Valid' })
  @ApiOkResponse({ description: 'Password is valid.' })
  @ApiBadRequestResponse({ description: 'Password is invalid.' })
  async checkPassword(@Param('password') password: string): Promise<void> {
    if (!password) {
      throw new BadRequestException();
    }
  }

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiOkResponse({ description: 'User access token', type: LoginResponse })
  async register(@Body() req: BasicAuthRegisterRequestDto): Promise<LoginResponse> {
    const { username, email, password } = req;
    if (!password) {
      throw new BadRequestException();
    }

    const userData: Partial<UserBaseEntity> = {
      password: await this.basicAuthService.hash(password),
    };

    if (this.options.username?.register?.required && !username) {
      throw new BadRequestException();
    } else if (this.options.username?.register && username) {
      await this.checkUsername(username);
      userData.username = username;
    }

    if (this.options.email?.register?.required && !email) {
      throw new BadRequestException();
    } else if (this.options.email?.register && email) {
      await this.checkEmail(email);
      userData.email = email;
    }

    const user = await this.authenticationService.register(userData, RegisterType.PASSWORD);
    return this.authenticationService.login(user);
  }
}
