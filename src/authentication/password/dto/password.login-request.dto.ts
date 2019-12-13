import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class PasswordLoginRequest {
  @ApiModelPropertyOptional()
  username?: string;

  @ApiModelPropertyOptional()
  email?: string;

  @ApiModelProperty()
  password: string;
}
