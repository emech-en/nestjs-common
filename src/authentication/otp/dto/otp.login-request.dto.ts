import { ApiModelProperty } from '@nestjs/swagger';

export class OtpLoginRequestDto {
  @ApiModelProperty()
  id: string;

  @ApiModelProperty()
  code: string;
}
