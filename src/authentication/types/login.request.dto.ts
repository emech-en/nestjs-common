import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { getEnumValues } from '../../utilities';
import { LoginType } from './login-type.enum';

export class LoginRequest {
  @ApiModelProperty({ enum: getEnumValues(LoginType) })
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
