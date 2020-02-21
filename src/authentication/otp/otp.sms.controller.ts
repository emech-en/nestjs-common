import { Controller, NotImplementedException, Param, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { OptGenerateResponseDto } from './dto';

@Controller('auth/otp/sms')
@ApiUseTags('auth/otp/sms')
export class OtpSmsController {
  @Post('/:phone')
  @ApiOperation({ title: 'Request OTP Code' })
  @ApiOkResponse({
    description: 'Id and expiration date of the created OTP Code',
    type: OptGenerateResponseDto,
  })
  async generateEmailOtp(@Param() phone: string): Promise<OptGenerateResponseDto> {
    throw new NotImplementedException();
    /*
     * ToDo: Check phone number is valid
     */
    // const otpCode = new OtpEntity();
    // otpCode.generateCode();
    // otpCode.expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    // otpCode.retryLeft = 3;
    // otpCode.type = OtpType.SMS;
    // otpCode.phone = phone;
    //
    // const { code, id, expiresAt } = await this.otpCodeRepository.save(otpCode);

    /*
     * ToDo: Send SmS to the phone number
     */
  }
}
