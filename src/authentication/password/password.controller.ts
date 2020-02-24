import { BadRequestException, Body, Controller, Patch, Post, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserBaseEntity } from '../models';
import { LoginResponse } from '../dto';
import { PasswordChangeRequestDto, PasswordLoginRequestDto, PasswordSetRequestDto } from './dto';
import { PasswordService } from './password.service';
import { AuthenticationService } from '../authentication.service';
import { RequestTransaction } from '../../request-transaction';
import { CurrentUserBase } from '../decorators';

@Controller('auth/password')
@ApiTags('Authentication')
export class PasswordController {
  constructor(
    private readonly requestTransaction: RequestTransaction,
    private readonly authenticationService: AuthenticationService,
    private readonly passwordService: PasswordService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login to System Using One Time Password' })
  @ApiOkResponse({ description: 'User access token', type: LoginResponse })
  async login(@Body() req: PasswordLoginRequestDto): Promise<LoginResponse> {
    const { username, email, password } = req;
    if ((!username && !email) || !password) {
      throw new BadRequestException();
    }

    const userRepo = this.requestTransaction.getRepository(UserBaseEntity);
    const user = await userRepo.findOne(email ? { email } : { username });

    if (!user || !user.password) {
      throw new UnauthorizedException();
    }

    if (await this.passwordService.verify(password, user.password)) {
      return this.authenticationService.login(user);
    } else {
      throw new UnauthorizedException();
    }
  }

  @Patch('/')
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
    if (!(await this.passwordService.verify(currentPassword, currentUser.password))) {
      throw new UnauthorizedException();
    }

    await this.passwordService.setUserPassword(currentUser, newPassword);
  }

  @Post('/')
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

    await this.passwordService.setUserPassword(currentUser, password);
  }
}
