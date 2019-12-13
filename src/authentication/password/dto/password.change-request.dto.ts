import { ApiModelProperty } from '@nestjs/swagger';

export class PasswordChangeRequest {
  @ApiModelProperty()
  currentPassword: string;
  @ApiModelProperty()
  newPassword: string;
}
