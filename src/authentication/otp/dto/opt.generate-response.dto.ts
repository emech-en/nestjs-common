import { ApiModelProperty } from '@nestjs/swagger';

export class OptGenerateResponseDto {
  @ApiModelProperty()
  id: string;

  @ApiModelProperty({ type: 'string', format: 'date-time' })
  expiresAt: Date;
}
