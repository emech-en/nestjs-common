import { BadRequestException, Body, Controller, Inject, Patch, Post, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserBaseEntity } from '../models';
import { LoginResponse } from '../dto';
import { PasswordChangeRequestDto, BasicAuthRequestDto, PasswordSetRequestDto } from './dto';
import { BasicAuthService } from './basic-auth.service';
import { AuthenticationService } from '../authentication.service';
import { RequestTransaction } from '../../request-transaction';
import { CurrentUserBase } from '../decorators';
import { BasicAuthOptions, BASIC_AUTH_OPTIONS } from './basic-auth.options';
import { FindConditions, IsNull, Not } from 'typeorm';

@Controller('auth/basic')
@ApiTags('Authentication')
export class BasicAuthController {
  constructor(
    private readonly requestTransaction: RequestTransaction,
    private readonly authenticationService: AuthenticationService,
    private readonly basicAuthService: BasicAuthService,
    @Inject(BASIC_AUTH_OPTIONS)
    private readonly options: BasicAuthOptions,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login to System Using Username/Email and Password' })
  @ApiOkResponse({ description: 'User access token', type: LoginResponse })
  async login(@Body() req: BasicAuthRequestDto): Promise<LoginResponse> {
    const { username, email, password } = req;
    if (!password) {
      throw new BadRequestException();
    }

    const query: FindConditions<UserBaseEntity> = {};
    if (this.options.email?.login && email) {
      query.email = email;
      if (this.options.email?.verification) {
        query.emailVerified = Not(IsNull());
      }
    } else if (this.options.username?.login && username) {
      query.username = username;
    } else {
      throw new BadRequestException();
    }

    const userRepo = this.requestTransaction.getRepository(UserBaseEntity);
    const user = await userRepo.findOne(query);

    if (!user || !user.password) {
      throw new UnauthorizedException();
    }

    if (await this.basicAuthService.verify(password, user.password)) {
      return this.authenticationService.login(user);
    } else {
      throw new UnauthorizedException();
    }
  }

  @Patch('/password')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change current user Password' })
  @ApiOkResponse({ description: 'Password Changed Successfully.' })
  async updatePassword(
    @CurrentUserBase() currentUser: UserBaseEntity,
    @Body() request: PasswordChangeRequestDto,
  ): Promise<void> {
    if (!currentUser.password) {
      throw new UnauthorizedException();
    }

    const { currentPassword, newPassword } = request;
    if (!(await this.basicAuthService.verify(currentPassword, currentUser.password))) {
      throw new UnauthorizedException();
    }

    await this.basicAuthService.setUserPassword(currentUser, newPassword);
  }

  @Post('/password')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set current user password' })
  @ApiOkResponse({ description: 'Password Set Successfully.' })
  async setPassword(
    @CurrentUserBase() currentUser: UserBaseEntity,
    @Body() { password }: PasswordSetRequestDto,
  ): Promise<void> {
    if (currentUser.password) {
      throw new UnauthorizedException();
    }

    await this.basicAuthService.setUserPassword(currentUser, password);
  }
}
