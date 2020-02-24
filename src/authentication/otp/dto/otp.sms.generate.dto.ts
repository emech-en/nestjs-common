import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class OtpSmsGenerateDto {
  @ApiProperty()
  @IsString()
  phone: string;
}
