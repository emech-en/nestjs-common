import { ApiModelProperty } from '@nestjs/swagger';

export class LoginResponse {
  @ApiModelProperty()
  token: string;
  @ApiModelProperty({ type: 'string', format: 'date-time' })
  expiresAt: Date;
}
