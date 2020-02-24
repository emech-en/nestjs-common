import { BadRequestException, Body, Controller, Head, Param, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserBaseEntity } from '../models';
import { LoginResponse } from '../dto';
import { AuthenticationService } from '../authentication.service';
import { PasswordRegisterRequestDto } from './dto';
import { PasswordService } from './password.service';
import { RequestTransaction } from '../../request-transaction';
import { RegisterType } from '../register';

@Controller('auth/password')
@ApiTags('Authentication')
export class PasswordRegisterController {
  constructor(
    private readonly requestTransaction: RequestTransaction,
    private readonly authenticationService: AuthenticationService,
    private readonly passwordService: PasswordService,
  ) {}

  @Head('username/:username')
  @ApiOperation({ summary: 'Check Username is Valid or Available' })
  @ApiOkResponse({ description: 'Username is valid.' })
  @ApiBadRequestResponse({ description: 'Username is invalid.' })
  async checkUsername(@Param('username') username: string): Promise<void> {
    if (!username) {
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
    if (!email) {
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

    const userData = {
      email,
      username,
      password: await this.passwordService.hash(password),
    };

    const user = await this.authenticationService.register(userData, RegisterType.PASSWORD);
    return this.authenticationService.login(user);
  }
}
