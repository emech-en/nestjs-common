import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class OtpEmailGenerateDto {
  @ApiProperty({ format: 'email' })
  @IsString()
  @IsEmail()
  email: string;
}
