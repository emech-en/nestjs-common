import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class PasswordRegisterRequestDto {
  @ApiModelPropertyOptional()
  email?: string;
  @ApiModelPropertyOptional()
  username?: string;
  @ApiModelProperty()
  password: string;
}
