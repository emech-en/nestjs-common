import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class PasswordLoginRequestDto {
  @ApiModelPropertyOptional()
  username?: string;
  @ApiModelPropertyOptional()
  email?: string;
  @ApiModelProperty()
  password: string;
}
