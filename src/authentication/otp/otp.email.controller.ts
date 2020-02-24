import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindOneOptions } from 'typeorm';
import { EmailService } from '../../email';
import { RequestTransaction } from '../../request-transaction';
import { AuthenticationService } from '../authentication.service';
import { OtpEmailEntity, UserBaseEntity } from '../models';
import { OtpController } from './otp.controller';
import { OtpEmailGenerateDto, OtpGenerateResponseDto } from './dto';

@Controller('auth/otp/email')
@ApiTags('Authentication')
export class OtpEmailController extends OtpController<OtpEmailEntity> {
  constructor(
    private readonly emailService: EmailService,
    requestTransaction: RequestTransaction,
    authenticationService: AuthenticationService,
  ) {
    super(OtpEmailEntity, requestTransaction, authenticationService);
  }

  @Post('request')
  @ApiOperation({ summary: 'Request OTP Code' })
  @ApiOkResponse({
    description: 'Id and expiration date of the created OTP Code',
    type: OtpGenerateResponseDto,
  })
  protected async generateCode(@Body() value: OtpEmailGenerateDto): Promise<OtpGenerateResponseDto> {
    const repo = this.requestTransaction.getRepository<OtpEmailEntity>(OtpEmailEntity);

    const newCode = new OtpEmailEntity();
    newCode.email = value.email;

    const { id, expiresAt, code } = await repo.save(newCode);

    /*
     * ToDo: Send an html content with full information and unsubscribe o ina
     */
    await this.emailService.send({
      to: value.email,
      subject: 'Login',
      html: `You login code is ${code}`,
    });
    return { id, expiresAt };
  }

  protected createNewUserData(otpCodeEntity: OtpEmailEntity): Partial<UserBaseEntity> {
    return { email: otpCodeEntity.email };
  }

  protected getRegisterData(otpCodeEntity: OtpEmailEntity): any {
    return { email: otpCodeEntity.email };
  }

  protected getUserFindQuery(otpCodeEntity: OtpEmailEntity): FindOneOptions<UserBaseEntity> {
    return { where: { email: otpCodeEntity.email } };
  }
}
