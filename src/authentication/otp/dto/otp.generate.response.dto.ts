import { ApiProperty } from '@nestjs/swagger';

export class OtpGenerateResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: 'string', format: 'date-time' })
  expiresAt: Date;
}
