import { ApiModelProperty } from '@nestjs/swagger';

export class OtpCodeResponse {
  @ApiModelProperty()
  id: string;
  @ApiModelProperty({ type: 'string', format: 'date-time' })
  expiresAt: Date;
}
