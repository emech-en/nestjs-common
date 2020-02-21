import { Controller, Inject, Param, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OtpEntity, OtpType } from '../models';
import { EmailService } from '../../email';
import { OptGenerateResponseDto } from './dto';

@Controller('auth/otp/email')
@ApiUseTags('auth/otp/email')
export class OtpEmailController {
  constructor(
    @InjectRepository(OtpEntity)
    private readonly otpCodeRepository: Repository<OtpEntity>,
    @Inject(EmailService)
    private readonly emailService: EmailService,
  ) {}

  @Post('/:email')
  @ApiOperation({ title: 'Request OTP Code' })
  @ApiOkResponse({
    description: 'Id and expiration date of the created OTP Code',
    type: OptGenerateResponseDto,
  })
  async generateEmailOtp(@Param() email: string): Promise<OptGenerateResponseDto> {
    /*
     * ToDo: Check email is valid
     */

    const emailCode = new OtpEntity();
    emailCode.generateCode();
    emailCode.expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    emailCode.retryLeft = 3;
    emailCode.type = OtpType.EMAIL;
    emailCode.email = email;

    const { code, id, expiresAt } = await this.otpCodeRepository.save(emailCode);

    /*
     * ToDo: Send an html content with full information and unsubscribe o ina
     */
    await this.emailService.send({
      to: email,
      subject: 'Login',
      html: `You login code is ${code}`,
    });
    return { id, expiresAt };
  }
}
