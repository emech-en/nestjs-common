import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindOneOptions } from 'typeorm';
import { OtpSmsEntity, UserBaseEntity } from '../models';
import { OtpController } from './otp.controller';
import { RequestTransaction } from '../../request-transaction';
import { AuthenticationService } from '../authentication.service';
import { OtpGenerateResponseDto, OtpSmsGenerateDto } from './dto';

const logger = new Logger('OtpSmsController');

@Controller('auth/otp/sms')
@ApiTags('Authentication')
export class OtpSmsController extends OtpController<OtpSmsEntity> {
  constructor(requestTransaction: RequestTransaction, authenticationService: AuthenticationService) {
    super(OtpSmsEntity, requestTransaction, authenticationService);
  }

  @Post('request')
  @ApiOperation({ summary: 'Request OTP Code' })
  @ApiOkResponse({
    description: 'Id and expiration date of the created OTP Code',
    type: OtpGenerateResponseDto,
  })
  protected async generateCode(@Body() value: OtpSmsGenerateDto): Promise<OtpGenerateResponseDto> {
    const repo = this.requestTransaction.getRepository<OtpSmsEntity>(OtpSmsEntity);

    const optCode = new OtpSmsEntity();
    optCode.phone = value.phone;
    const { id, expiresAt, code } = await repo.save(optCode);

    // ToDo: Send Sms To Phone Number
    logger.log(`SMS to=${value.phone} code=${code}`);

    return { id, expiresAt };
  }

  protected createNewUserData(otpCodeEntity: OtpSmsEntity): Partial<UserBaseEntity> {
    return { phone: otpCodeEntity.phone };
  }

  protected getRegisterData(otpCodeEntity: OtpSmsEntity): any {
    return { phone: otpCodeEntity.phone };
  }

  protected getUserFindQuery(otpCodeEntity: OtpSmsEntity): FindOneOptions<UserBaseEntity> {
    return { where: { phone: otpCodeEntity.phone } };
  }
}
