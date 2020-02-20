import { ApiModelProperty } from '@nestjs/swagger';
import { OtpType } from '../../models';

export class OptGenerateRequestDto {
  @ApiModelProperty()
  type: OtpType;

  @ApiModelProperty()
  value: string;
}
