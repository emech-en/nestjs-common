import { Body, Logger, Post, UnauthorizedException } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { DeepPartial, FindOneOptions, ObjectType } from 'typeorm';
import { OtpAbstractEntity, UserBaseEntity } from '../models';
import { LoginResponse } from '../dto';
import { OtpLoginDto } from './dto';
import { AuthenticationService } from '../authentication.service';
import { RequestTransaction } from '../../request-transaction';
import { RegisterType } from '../register';

const logger = new Logger('OtpController');

export abstract class OtpController<T extends OtpAbstractEntity> {
  protected constructor(
    protected readonly target: ObjectType<T>,
    protected readonly requestTransaction: RequestTransaction,
    protected readonly authenticationService: AuthenticationService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login to System Using One Time Password' })
  @ApiOkResponse({ description: 'User access token', type: LoginResponse })
  async login(@Body() { id, code }: OtpLoginDto): Promise<LoginResponse> {
    const otpCode = await this.findAndValidateOtpCode(id, code);
    otpCode.usedAt = new Date();

    const otpCodeRepo = this.requestTransaction.getRepository(this.target);
    await otpCodeRepo.save(otpCode as DeepPartial<T>);

    const userRepo = this.requestTransaction.getRepository(UserBaseEntity);
    let user = await userRepo.findOne(this.getUserFindQuery(otpCode));

    if (!user) {
      const userData = this.createNewUserData(otpCode);
      user = await this.authenticationService.register(userData, RegisterType.OTP, this.getRegisterData(otpCode));
    }

    return await this.authenticationService.login(user);
  }

  protected abstract getUserFindQuery(otpCodeEntity: T): FindOneOptions<UserBaseEntity>;

  protected abstract createNewUserData(otpCodeEntity: T): Partial<UserBaseEntity>;

  protected abstract getRegisterData(otpCodeEntity: T): any;

  private async findAndValidateOtpCode(id: string, code: string): Promise<T> {
    const repo = this.requestTransaction.getRepository<T>(this.target, false);
    const otpCode = await repo.findOne(id);

    if (!otpCode) {
      logger.verbose(`OtpCode Not Found: type=${this.target.name} id=${id}`);
      throw new UnauthorizedException();
    } else if (otpCode.isExpired()) {
      logger.verbose(`OtpCode Is Expired: type=${this.target.name} id=${id}`);
      throw new UnauthorizedException();
    } else if (otpCode.code !== code) {
      logger.verbose(`Code Is Wrong: type=${this.target.name} id=${id} code=${code}`);
      otpCode.retryLeft--;
      await repo.save(otpCode as DeepPartial<T>);
      throw new UnauthorizedException();
    }

    return otpCode;
  }
}
