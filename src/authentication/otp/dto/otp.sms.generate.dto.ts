import { ApiProperty } from '@nestjs/swagger';

export class OtpEmailGenerateDto {
  @ApiProperty({ format: 'email' })
  email: string;
}
