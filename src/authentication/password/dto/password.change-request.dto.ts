import { ApiModelProperty } from '@nestjs/swagger';

export class PasswordChangeRequestDto {
  @ApiModelProperty()
  currentPassword: string;
  @ApiModelProperty()
  newPassword: string;
}
