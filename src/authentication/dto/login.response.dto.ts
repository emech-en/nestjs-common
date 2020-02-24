import { ApiProperty } from '@nestjs/swagger';

export class LoginResponse {
  @ApiProperty()
  token: string;
  @ApiProperty({ type: 'string', format: 'date-time' })
  expiresAt: Date;
}
