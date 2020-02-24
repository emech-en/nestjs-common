import { ApiProperty } from '@nestjs/swagger';

export class OtpLoginRequestDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;
}
