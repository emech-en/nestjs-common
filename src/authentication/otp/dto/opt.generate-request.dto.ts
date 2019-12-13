import { ApiModelProperty } from '@nestjs/swagger';
import { OtpType } from './otp.entity';

export class OptGenerateRequestDto {
  @ApiModelProperty()
  type: OtpType;

  @ApiModelProperty()
  value: string;
}
