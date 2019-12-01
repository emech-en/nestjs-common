import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { enumToArray } from '../../utils';
import { LoginType } from './login-type.enum';

export class LoginRequest {
  @ApiModelProperty({ enum: enumToArray(LoginType) })
  type: LoginType;

  @ApiModelPropertyOptional()
  username?: string;

  @ApiModelPropertyOptional()
  email?: string;

  @ApiModelPropertyOptional()
  password?: string;

  @ApiModelPropertyOptional()
  id?: string;

  @ApiModelPropertyOptional()
  code?: string;
}
