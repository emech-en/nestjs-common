import { ApiModelProperty } from '@nestjs/swagger';

export class ChangePasswordRequest {
  @ApiModelProperty()
  currentPassword: string;
  @ApiModelProperty()
  newPassword: string;
}
